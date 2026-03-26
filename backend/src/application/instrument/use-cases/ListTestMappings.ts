import { IInstrumentTestMappingRepository } from '../../../domain/instrument/repositories/IInstrumentTestMappingRepository';
import { InstrumentTestMappingDto } from '../dto/InstrumentTestMappingDto';

export class ListTestMappings {
  constructor(private readonly repo: IInstrumentTestMappingRepository) {}

  async execute(instrumentId: string): Promise<InstrumentTestMappingDto[]> {
    const mappings = await this.repo.listByInstrument(instrumentId);
    return mappings.map(InstrumentTestMappingDto.from);
  }
}
