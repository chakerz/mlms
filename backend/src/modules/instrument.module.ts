import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import {
  PersistenceModule,
  INSTRUMENT_REPOSITORY,
  INSTRUMENT_CONNECTION_REPOSITORY,
  INSTRUMENT_TEST_MAPPING_REPOSITORY,
  INSTRUMENT_ORDER_OUTBOX_REPOSITORY,
  INSTRUMENT_RESULT_INBOX_REPOSITORY,
  INSTRUMENT_RAW_RESULT_REPOSITORY,
} from './persistence.module';
import { IInstrumentRepository } from '../domain/instrument/repositories/IInstrumentRepository';
import { IInstrumentConnectionRepository } from '../domain/instrument/repositories/IInstrumentConnectionRepository';
import { IInstrumentTestMappingRepository } from '../domain/instrument/repositories/IInstrumentTestMappingRepository';
import { IInstrumentOrderOutboxRepository } from '../domain/instrument/repositories/IInstrumentOrderOutboxRepository';
import { IInstrumentResultInboxRepository } from '../domain/instrument/repositories/IInstrumentResultInboxRepository';
import { IInstrumentRawResultRepository } from '../domain/instrument/repositories/IInstrumentRawResultRepository';
import { CreateInstrument } from '../application/instrument/use-cases/CreateInstrument';
import { GetInstrumentById } from '../application/instrument/use-cases/GetInstrumentById';
import { ListInstruments } from '../application/instrument/use-cases/ListInstruments';
import { UpdateInstrument } from '../application/instrument/use-cases/UpdateInstrument';
import { DeleteInstrument } from '../application/instrument/use-cases/DeleteInstrument';
import { SetInstrumentConnection } from '../application/instrument/use-cases/SetInstrumentConnection';
import { GetInstrumentConnection } from '../application/instrument/use-cases/GetInstrumentConnection';
import { CreateTestMapping } from '../application/instrument/use-cases/CreateTestMapping';
import { ListTestMappings } from '../application/instrument/use-cases/ListTestMappings';
import { UpdateTestMapping } from '../application/instrument/use-cases/UpdateTestMapping';
import { DeleteTestMapping } from '../application/instrument/use-cases/DeleteTestMapping';
import { ListOutboxMessages } from '../application/instrument/use-cases/ListOutboxMessages';
import { GetOutboxMessage } from '../application/instrument/use-cases/GetOutboxMessage';
import { RetryOutboxMessage } from '../application/instrument/use-cases/RetryOutboxMessage';
import { CancelOutboxMessage } from '../application/instrument/use-cases/CancelOutboxMessage';
import { ListInboxMessages } from '../application/instrument/use-cases/ListInboxMessages';
import { GetInboxMessage } from '../application/instrument/use-cases/GetInboxMessage';
import { ReprocessInboxMessage } from '../application/instrument/use-cases/ReprocessInboxMessage';
import { ListRawResults } from '../application/instrument/use-cases/ListRawResults';
import { GetRawResult } from '../application/instrument/use-cases/GetRawResult';
import { SendOrderToInstrument } from '../application/instrument/use-cases/SendOrderToInstrument';
import { InstrumentTcpClientService } from '../infrastructure/astm/InstrumentTcpClientService';
import { InstrumentController } from '../interfaces/http/controllers/InstrumentController';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { ListInstrumentCatalog } from '../application/instrument/use-cases/ListInstrumentCatalog';
import { CreateInstrumentCatalogEntry } from '../application/instrument/use-cases/CreateInstrumentCatalogEntry';
import { UpdateInstrumentCatalogEntry } from '../application/instrument/use-cases/UpdateInstrumentCatalogEntry';
import { GetSimulatorConfig } from '../application/instrument/use-cases/GetSimulatorConfig';
import { UpsertSimulatorConfig } from '../application/instrument/use-cases/UpsertSimulatorConfig';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    { provide: CreateInstrument, useFactory: (r: IInstrumentRepository) => new CreateInstrument(r), inject: [INSTRUMENT_REPOSITORY] },
    { provide: GetInstrumentById, useFactory: (r: IInstrumentRepository) => new GetInstrumentById(r), inject: [INSTRUMENT_REPOSITORY] },
    { provide: ListInstruments, useFactory: (r: IInstrumentRepository) => new ListInstruments(r), inject: [INSTRUMENT_REPOSITORY] },
    { provide: UpdateInstrument, useFactory: (r: IInstrumentRepository) => new UpdateInstrument(r), inject: [INSTRUMENT_REPOSITORY] },
    { provide: DeleteInstrument, useFactory: (r: IInstrumentRepository) => new DeleteInstrument(r), inject: [INSTRUMENT_REPOSITORY] },
    { provide: SetInstrumentConnection, useFactory: (r: IInstrumentConnectionRepository) => new SetInstrumentConnection(r), inject: [INSTRUMENT_CONNECTION_REPOSITORY] },
    { provide: GetInstrumentConnection, useFactory: (r: IInstrumentConnectionRepository) => new GetInstrumentConnection(r), inject: [INSTRUMENT_CONNECTION_REPOSITORY] },
    { provide: CreateTestMapping, useFactory: (r: IInstrumentTestMappingRepository) => new CreateTestMapping(r), inject: [INSTRUMENT_TEST_MAPPING_REPOSITORY] },
    { provide: ListTestMappings, useFactory: (r: IInstrumentTestMappingRepository) => new ListTestMappings(r), inject: [INSTRUMENT_TEST_MAPPING_REPOSITORY] },
    { provide: UpdateTestMapping, useFactory: (r: IInstrumentTestMappingRepository) => new UpdateTestMapping(r), inject: [INSTRUMENT_TEST_MAPPING_REPOSITORY] },
    { provide: DeleteTestMapping, useFactory: (r: IInstrumentTestMappingRepository) => new DeleteTestMapping(r), inject: [INSTRUMENT_TEST_MAPPING_REPOSITORY] },
    { provide: ListOutboxMessages, useFactory: (r: IInstrumentOrderOutboxRepository) => new ListOutboxMessages(r), inject: [INSTRUMENT_ORDER_OUTBOX_REPOSITORY] },
    { provide: GetOutboxMessage, useFactory: (r: IInstrumentOrderOutboxRepository) => new GetOutboxMessage(r), inject: [INSTRUMENT_ORDER_OUTBOX_REPOSITORY] },
    { provide: RetryOutboxMessage, useFactory: (r: IInstrumentOrderOutboxRepository) => new RetryOutboxMessage(r), inject: [INSTRUMENT_ORDER_OUTBOX_REPOSITORY] },
    { provide: CancelOutboxMessage, useFactory: (r: IInstrumentOrderOutboxRepository) => new CancelOutboxMessage(r), inject: [INSTRUMENT_ORDER_OUTBOX_REPOSITORY] },
    { provide: ListInboxMessages, useFactory: (r: IInstrumentResultInboxRepository) => new ListInboxMessages(r), inject: [INSTRUMENT_RESULT_INBOX_REPOSITORY] },
    { provide: GetInboxMessage, useFactory: (r: IInstrumentResultInboxRepository) => new GetInboxMessage(r), inject: [INSTRUMENT_RESULT_INBOX_REPOSITORY] },
    { provide: ReprocessInboxMessage, useFactory: (r: IInstrumentResultInboxRepository) => new ReprocessInboxMessage(r), inject: [INSTRUMENT_RESULT_INBOX_REPOSITORY] },
    { provide: ListRawResults, useFactory: (r: IInstrumentRawResultRepository) => new ListRawResults(r), inject: [INSTRUMENT_RAW_RESULT_REPOSITORY] },
    { provide: GetRawResult, useFactory: (r: IInstrumentRawResultRepository) => new GetRawResult(r), inject: [INSTRUMENT_RAW_RESULT_REPOSITORY] },
    InstrumentTcpClientService,
    { provide: ListInstrumentCatalog, useFactory: (p: PrismaService) => new ListInstrumentCatalog(p), inject: [PrismaService] },
    { provide: CreateInstrumentCatalogEntry, useFactory: (p: PrismaService) => new CreateInstrumentCatalogEntry(p), inject: [PrismaService] },
    { provide: UpdateInstrumentCatalogEntry, useFactory: (p: PrismaService) => new UpdateInstrumentCatalogEntry(p), inject: [PrismaService] },
    { provide: GetSimulatorConfig, useFactory: (p: PrismaService) => new GetSimulatorConfig(p), inject: [PrismaService] },
    { provide: UpsertSimulatorConfig, useFactory: (p: PrismaService) => new UpsertSimulatorConfig(p), inject: [PrismaService] },
    {
      provide: SendOrderToInstrument,
      useFactory: (
        iRepo: IInstrumentRepository,
        cRepo: IInstrumentConnectionRepository,
        mRepo: IInstrumentTestMappingRepository,
        oRepo: IInstrumentOrderOutboxRepository,
        inboxRepo: IInstrumentResultInboxRepository,
        rawRepo: IInstrumentRawResultRepository,
        tcpClient: InstrumentTcpClientService,
        prisma: PrismaService,
      ) => new SendOrderToInstrument(iRepo, cRepo, mRepo, oRepo, inboxRepo, rawRepo, tcpClient, prisma),
      inject: [
        INSTRUMENT_REPOSITORY,
        INSTRUMENT_CONNECTION_REPOSITORY,
        INSTRUMENT_TEST_MAPPING_REPOSITORY,
        INSTRUMENT_ORDER_OUTBOX_REPOSITORY,
        INSTRUMENT_RESULT_INBOX_REPOSITORY,
        INSTRUMENT_RAW_RESULT_REPOSITORY,
        InstrumentTcpClientService,
        PrismaService,
      ],
    },
  ],
  controllers: [InstrumentController],
})
export class InstrumentModule {}
