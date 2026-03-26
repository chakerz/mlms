import { NotFoundException } from '@nestjs/common';
import { IInstrumentRepository } from '../../../domain/instrument/repositories/IInstrumentRepository';
import { InstrumentDto } from '../dto/InstrumentDto';

export class GetInstrumentById {
  constructor(private readonly repo: IInstrumentRepository) {}

  async execute(id: string): Promise<InstrumentDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundException(`Instrument ${id} not found`);
    return InstrumentDto.from(entity);
  }
}
