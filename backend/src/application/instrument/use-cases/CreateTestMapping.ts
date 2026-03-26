import { IInstrumentTestMappingRepository } from '../../../domain/instrument/repositories/IInstrumentTestMappingRepository';
import { InstrumentTestMapping } from '../../../domain/instrument/entities/InstrumentTestMapping';
import { CreateInstrumentTestMappingDto, InstrumentTestMappingDto } from '../dto/InstrumentTestMappingDto';

export class CreateTestMapping {
  constructor(private readonly repo: IInstrumentTestMappingRepository) {}

  async execute(instrumentId: string, dto: CreateInstrumentTestMappingDto): Promise<InstrumentTestMappingDto> {
    const entity = new InstrumentTestMapping('', instrumentId, dto.internalTestCode,
      dto.instrumentTestCode, dto.sampleType ?? null, dto.specimenCode ?? null,
      dto.unit ?? null, true, new Date(), new Date());
    const saved = await this.repo.save(entity);
    return InstrumentTestMappingDto.from(saved);
  }
}
