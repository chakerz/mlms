import { Instrument } from '../entities/Instrument';

export interface ListInstrumentsQuery {
  page: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
}

export interface IInstrumentRepository {
  findById(id: string): Promise<Instrument | null>;
  save(entity: Instrument): Promise<Instrument>;
  update(id: string, data: Partial<Instrument>): Promise<Instrument>;
  list(query: ListInstrumentsQuery): Promise<{ instruments: Instrument[]; total: number }>;
  delete(id: string): Promise<void>;
}
