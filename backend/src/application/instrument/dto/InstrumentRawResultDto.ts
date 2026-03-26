import { InstrumentRawResult } from '../../../domain/instrument/entities/InstrumentRawResult';

export class InstrumentRawResultDto {
  id!: string;
  instrumentId!: string;
  specimenId!: string | null;
  orderId!: string | null;
  internalTestCode!: string | null;
  instrumentTestCode!: string;
  resultValue!: string | null;
  resultText!: string | null;
  unit!: string | null;
  flagCode!: string | null;
  deviceStatus!: string | null;
  resultStatus!: string;
  measuredAt!: string | null;
  importedAt!: string | null;
  rawMessageId!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static from(e: InstrumentRawResult): InstrumentRawResultDto {
    const dto = new InstrumentRawResultDto();
    Object.assign(dto, e);
    dto.measuredAt = e.measuredAt ? e.measuredAt.toISOString() : null;
    dto.importedAt = e.importedAt ? e.importedAt.toISOString() : null;
    dto.createdAt = e.createdAt.toISOString();
    dto.updatedAt = e.updatedAt.toISOString();
    return dto;
  }
}
