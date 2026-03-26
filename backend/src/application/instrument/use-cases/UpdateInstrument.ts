import { NotFoundException } from '@nestjs/common';
import { IInstrumentRepository } from '../../../domain/instrument/repositories/IInstrumentRepository';
import { UpdateInstrumentDto, InstrumentDto } from '../dto/InstrumentDto';

export class UpdateInstrument {
  constructor(private readonly repo: IInstrumentRepository) {}

  async execute(id: string, dto: UpdateInstrumentDto): Promise<InstrumentDto> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Instrument ${id} not found`);
    const updated = await this.repo.update(id, dto);
    return InstrumentDto.from(updated);
  }
}
