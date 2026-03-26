import { NotFoundException } from '@nestjs/common';
import { IInstrumentTestMappingRepository } from '../../../domain/instrument/repositories/IInstrumentTestMappingRepository';
import { UpdateInstrumentTestMappingDto, InstrumentTestMappingDto } from '../dto/InstrumentTestMappingDto';

export class UpdateTestMapping {
  constructor(private readonly repo: IInstrumentTestMappingRepository) {}

  async execute(id: string, dto: UpdateInstrumentTestMappingDto): Promise<InstrumentTestMappingDto> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Test mapping ${id} not found`);
    const updated = await this.repo.update(id, dto);
    return InstrumentTestMappingDto.from(updated);
  }
}
