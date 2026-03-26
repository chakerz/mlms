import { InstrumentMessageAudit } from '../entities/InstrumentMessageAudit';

export interface ListAuditQuery {
  page: number;
  pageSize: number;
  instrumentId?: string;
  direction?: string;
}

export interface IInstrumentMessageAuditRepository {
  save(entity: InstrumentMessageAudit): Promise<InstrumentMessageAudit>;
  list(query: ListAuditQuery): Promise<{ entries: InstrumentMessageAudit[]; total: number }>;
}
