import { IInstrumentRepository } from '../../../domain/instrument/repositories/IInstrumentRepository';
import { Instrument } from '../../../domain/instrument/entities/Instrument';
import { CreateInstrumentDto, InstrumentDto } from '../dto/InstrumentDto';

export class CreateInstrument {
  constructor(private readonly repo: IInstrumentRepository) {}

  async execute(dto: CreateInstrumentDto): Promise<InstrumentDto> {
    const entity = new Instrument('', dto.code, dto.name, dto.manufacturer ?? null,
      dto.model ?? null, dto.protocolType, dto.transportType, dto.directionMode,
      true, dto.location ?? null, new Date(), new Date());
    const saved = await this.repo.save(entity);
    return InstrumentDto.from(saved);
  }
}
