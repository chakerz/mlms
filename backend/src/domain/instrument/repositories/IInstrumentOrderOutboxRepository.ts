import { InstrumentOrderOutbox } from '../entities/InstrumentOrderOutbox';

export interface ListOutboxQuery {
  page: number;
  pageSize: number;
  instrumentId?: string;
  status?: string;
}

export interface IInstrumentOrderOutboxRepository {
  findById(id: string): Promise<InstrumentOrderOutbox | null>;
  save(entity: InstrumentOrderOutbox): Promise<InstrumentOrderOutbox>;
  update(id: string, data: Partial<InstrumentOrderOutbox>): Promise<InstrumentOrderOutbox>;
  list(query: ListOutboxQuery): Promise<{ messages: InstrumentOrderOutbox[]; total: number }>;
}
