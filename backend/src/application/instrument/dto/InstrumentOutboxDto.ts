import { InstrumentOrderOutbox } from '../../../domain/instrument/entities/InstrumentOrderOutbox';

export class InstrumentOutboxDto {
  id!: string;
  instrumentId!: string;
  specimenId!: string | null;
  orderId!: string | null;
  messageType!: string;
  payloadJson!: unknown;
  rawPayload!: string | null;
  status!: string;
  retryCount!: number;
  sentAt!: string | null;
  ackReceivedAt!: string | null;
  errorMessage!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static from(e: InstrumentOrderOutbox): InstrumentOutboxDto {
    const dto = new InstrumentOutboxDto();
    Object.assign(dto, e);
    dto.sentAt = e.sentAt ? e.sentAt.toISOString() : null;
    dto.ackReceivedAt = e.ackReceivedAt ? e.ackReceivedAt.toISOString() : null;
    dto.createdAt = e.createdAt.toISOString();
    dto.updatedAt = e.updatedAt.toISOString();
    return dto;
  }
}
