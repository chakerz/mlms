import { NotFoundException } from '@nestjs/common';
import { IInstrumentConnectionRepository } from '../../../domain/instrument/repositories/IInstrumentConnectionRepository';
import { InstrumentConnectionDto } from '../dto/InstrumentConnectionDto';

export class GetInstrumentConnection {
  constructor(private readonly repo: IInstrumentConnectionRepository) {}

  async execute(instrumentId: string): Promise<InstrumentConnectionDto> {
    const entity = await this.repo.findByInstrumentId(instrumentId);
    if (!entity) throw new NotFoundException(`Connection for instrument ${instrumentId} not found`);
    return InstrumentConnectionDto.from(entity);
  }
}
