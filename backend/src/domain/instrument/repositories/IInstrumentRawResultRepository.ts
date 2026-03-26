import { InstrumentRawResult } from '../entities/InstrumentRawResult';

export interface ListRawResultsQuery {
  page: number;
  pageSize: number;
  instrumentId?: string;
  specimenId?: string;
  resultStatus?: string;
}

export interface IInstrumentRawResultRepository {
  findById(id: string): Promise<InstrumentRawResult | null>;
  save(entity: InstrumentRawResult): Promise<InstrumentRawResult>;
  update(id: string, data: Partial<InstrumentRawResult>): Promise<InstrumentRawResult>;
  list(query: ListRawResultsQuery): Promise<{ results: InstrumentRawResult[]; total: number }>;
}
