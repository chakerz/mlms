import { InstrumentResultInbox } from '../../../domain/instrument/entities/InstrumentResultInbox';

export class InstrumentInboxDto {
  id!: string;
  instrumentId!: string;
  messageType!: string;
  rawPayload!: string;
  parsedPayloadJson!: unknown | null;
  sampleId!: string | null;
  barcode!: string | null;
  matchingStatus!: string;
  importStatus!: string;
  receivedAt!: string;
  processedAt!: string | null;
  errorMessage!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static from(e: InstrumentResultInbox): InstrumentInboxDto {
    const dto = new InstrumentInboxDto();
    Object.assign(dto, e);
    dto.receivedAt = e.receivedAt.toISOString();
    dto.processedAt = e.processedAt ? e.processedAt.toISOString() : null;
    dto.createdAt = e.createdAt.toISOString();
    dto.updatedAt = e.updatedAt.toISOString();
    return dto;
  }
}
