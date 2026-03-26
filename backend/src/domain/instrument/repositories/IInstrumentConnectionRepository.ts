import { InstrumentConnection } from '../entities/InstrumentConnection';

export interface IInstrumentConnectionRepository {
  findByInstrumentId(instrumentId: string): Promise<InstrumentConnection | null>;
  upsert(instrumentId: string, data: Partial<InstrumentConnection>): Promise<InstrumentConnection>;
}
