import { Logger } from '@nestjs/common';
import { IInstrumentRepository } from '../../../domain/instrument/repositories/IInstrumentRepository';
import { IInstrumentConnectionRepository } from '../../../domain/instrument/repositories/IInstrumentConnectionRepository';
import { IInstrumentTestMappingRepository } from '../../../domain/instrument/repositories/IInstrumentTestMappingRepository';
import { IInstrumentOrderOutboxRepository } from '../../../domain/instrument/repositories/IInstrumentOrderOutboxRepository';
import { IInstrumentResultInboxRepository } from '../../../domain/instrument/repositories/IInstrumentResultInboxRepository';
import { IInstrumentRawResultRepository } from '../../../domain/instrument/repositories/IInstrumentRawResultRepository';
import { InstrumentOrderOutbox } from '../../../domain/instrument/entities/InstrumentOrderOutbox';
import { InstrumentResultInbox } from '../../../domain/instrument/entities/InstrumentResultInbox';
import { InstrumentRawResult } from '../../../domain/instrument/entities/InstrumentRawResult';
import { InstrumentTcpClientService } from '../../../infrastructure/astm/InstrumentTcpClientService';
import { buildAstmOrderMessage, parseAstmResults, AstmOrderData } from '../../../infrastructure/astm/AstmFrameBuilder';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface SendOrderToInstrumentResult {
  sent: boolean;
  resultCount: number;
  rawResponse: string;
  outboxId: string;
  inboxId?: string;
  error?: string;
}

export class SendOrderToInstrument {
  private readonly logger = new Logger(SendOrderToInstrument.name);

  constructor(
    private readonly instrumentRepo: IInstrumentRepository,
    private readonly connectionRepo: IInstrumentConnectionRepository,
    private readonly mappingRepo: IInstrumentTestMappingRepository,
    private readonly outboxRepo: IInstrumentOrderOutboxRepository,
    private readonly inboxRepo: IInstrumentResultInboxRepository,
    private readonly rawResultRepo: IInstrumentRawResultRepository,
    private readonly tcpClient: InstrumentTcpClientService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(orderId: string, instrumentId: string): Promise<SendOrderToInstrumentResult> {
    // Load instrument
    const instrument = await this.instrumentRepo.findById(instrumentId);
    if (!instrument) {
      return { sent: false, resultCount: 0, rawResponse: '', outboxId: '', error: `Instrument ${instrumentId} not found` };
    }

    // Load connection
    const connection = await this.connectionRepo.findByInstrumentId(instrumentId);
    if (!connection || !connection.host || !connection.port) {
      return { sent: false, resultCount: 0, rawResponse: '', outboxId: '', error: `Instrument has no TCP connection configured (host: ${connection?.host}, port: ${connection?.port})` };
    }

    // Load order with patient and test items
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        patient: true,
        tests: true,
      },
    });
    if (!order) {
      return { sent: false, resultCount: 0, rawResponse: '', outboxId: '', error: `Order ${orderId} not found` };
    }

    // Load test mappings for the instrument
    const mappings = await this.mappingRepo.listByInstrument(instrumentId);
    const mappingMap = new Map(mappings.map(m => [m.internalTestCode, m.instrumentTestCode]));

    // Resolve test codes: use mapped code if available, otherwise use internal code
    const testCodes = order.tests.map((t) => mappingMap.get(t.testCode) ?? t.testCode);

    // Build patient name
    const patientName = `${order.patient.lastName}^${order.patient.firstName}`;
    const dob = order.patient.birthDate
      ? order.patient.birthDate.toISOString().substring(0, 10).replace(/-/g, '')
      : '';
    const sex = order.patient.gender === 'M' ? 'M' : order.patient.gender === 'F' ? 'F' : 'U';

    const astmData: AstmOrderData = {
      sampleId: orderId.slice(-8).toUpperCase(),
      accessionNumber: orderId,
      patientId: order.patientId,
      patientName,
      dob,
      sex,
      testCodes,
      sendingFacility: 'MLMS',
    };

    // Build ASTM frames
    const frames = buildAstmOrderMessage(astmData);
    const rawPayload = frames.map(f => f.toString('latin1')).join('');

    // Create outbox entry (PENDING)
    const now = new Date();
    const outbox = await this.outboxRepo.save(
      new InstrumentOrderOutbox(
        '',
        instrumentId,
        null,
        orderId,
        'ASTM_ORDER',
        { orderId, testCodes },
        rawPayload,
        'PENDING',
        0,
        null,
        null,
        null,
        now,
        now,
      ),
    );

    // Send via TCP
    this.logger.log(`[SendOrderToInstrument] Sending order ${orderId} to ${connection.host}:${connection.port}`);
    const tcpResult = await this.tcpClient.sendAndReceive(
      connection.host,
      connection.port,
      frames,
      connection.timeoutMs ?? 30000,
    );

    if (!tcpResult.success) {
      // Update outbox as FAILED
      await this.outboxRepo.update(outbox.id, {
        status: 'FAILED' as any,
        errorMessage: tcpResult.error,
      } as any);

      return {
        sent: false,
        resultCount: 0,
        rawResponse: tcpResult.rawResponse,
        outboxId: outbox.id,
        error: tcpResult.error,
      };
    }

    // Update outbox as SENT
    await this.outboxRepo.update(outbox.id, {
      status: 'SENT' as any,
      sentAt: new Date(),
      ackReceivedAt: new Date(),
      rawPayload: tcpResult.rawResponse,
    } as any);

    // Parse results from response
    const parsedResults = parseAstmResults(tcpResult.rawResponse);

    // Create inbox entry
    let inboxEntry: InstrumentResultInbox | undefined;
    if (parsedResults.length > 0 || tcpResult.rawResponse.length > 0) {
      const receivedAt = new Date();
      inboxEntry = await this.inboxRepo.save(
        new InstrumentResultInbox(
          '',
          instrumentId,
          'ASTM_RESULT',
          tcpResult.rawResponse,
          parsedResults.length > 0 ? parsedResults : null,
          astmData.sampleId,
          null,
          'MATCHED_BY_SAMPLE_ID',
          'RECEIVED',
          receivedAt,
          null,
          null,
          receivedAt,
          receivedAt,
        ),
      );
    }

    // Create raw result entries (one per parsed result)
    const importedAt = new Date();
    for (const result of parsedResults) {
      const internalCode = mappings.find(m => m.instrumentTestCode === result.testCode)?.internalTestCode ?? result.testCode;
      await this.rawResultRepo.save(
        new InstrumentRawResult(
          '',
          instrumentId,
          null,
          orderId,
          internalCode,
          result.testCode,
          result.value,
          null,
          result.unit || null,
          result.flag,
          null,
          'RAW_RECEIVED',
          importedAt,
          importedAt,
          inboxEntry?.id ?? null,
          importedAt,
          importedAt,
        ),
      );
    }

    this.logger.log(`[SendOrderToInstrument] Order ${orderId} sent. ${parsedResults.length} results received.`);

    return {
      sent: true,
      resultCount: parsedResults.length,
      rawResponse: tcpResult.rawResponse,
      outboxId: outbox.id,
      inboxId: inboxEntry?.id,
    };
  }
}
