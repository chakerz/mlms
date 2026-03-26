import { IInstrumentConnectionRepository } from '../../../domain/instrument/repositories/IInstrumentConnectionRepository';
import { UpsertInstrumentConnectionDto, InstrumentConnectionDto } from '../dto/InstrumentConnectionDto';

export class SetInstrumentConnection {
  constructor(private readonly repo: IInstrumentConnectionRepository) {}

  async execute(instrumentId: string, dto: UpsertInstrumentConnectionDto): Promise<InstrumentConnectionDto> {
    const entity = await this.repo.upsert(instrumentId, dto);
    return InstrumentConnectionDto.from(entity);
  }
}
