import { InstrumentTestMapping } from '../entities/InstrumentTestMapping';

export interface IInstrumentTestMappingRepository {
  findById(id: string): Promise<InstrumentTestMapping | null>;
  save(entity: InstrumentTestMapping): Promise<InstrumentTestMapping>;
  update(id: string, data: Partial<InstrumentTestMapping>): Promise<InstrumentTestMapping>;
  delete(id: string): Promise<void>;
  listByInstrument(instrumentId: string): Promise<InstrumentTestMapping[]>;
}
