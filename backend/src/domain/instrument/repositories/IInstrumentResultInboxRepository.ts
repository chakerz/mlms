import { InstrumentResultInbox } from '../entities/InstrumentResultInbox';

export interface ListInboxQuery {
  page: number;
  pageSize: number;
  instrumentId?: string;
  importStatus?: string;
  matchingStatus?: string;
}

export interface IInstrumentResultInboxRepository {
  findById(id: string): Promise<InstrumentResultInbox | null>;
  save(entity: InstrumentResultInbox): Promise<InstrumentResultInbox>;
  update(id: string, data: Partial<InstrumentResultInbox>): Promise<InstrumentResultInbox>;
  list(query: ListInboxQuery): Promise<{ messages: InstrumentResultInbox[]; total: number }>;
}
