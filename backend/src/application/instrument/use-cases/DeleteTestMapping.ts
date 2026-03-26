import { NotFoundException } from '@nestjs/common';
import { IInstrumentTestMappingRepository } from '../../../domain/instrument/repositories/IInstrumentTestMappingRepository';

export class DeleteTestMapping {
  constructor(private readonly repo: IInstrumentTestMappingRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(`Test mapping ${id} not found`);
    await this.repo.delete(id);
  }
}
