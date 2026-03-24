import { NotFoundException } from '@nestjs/common';
import { INonConformiteRepository } from '../../../domain/non-conformite/repositories/INonConformiteRepository';
import { NonConformiteDto } from '../dto/NonConformiteDto';

export class GetNonConformite {
  constructor(private readonly repo: INonConformiteRepository) {}

  async execute(id: string): Promise<NonConformiteDto> {
    const nc = await this.repo.findById(id);
    if (!nc) throw new NotFoundException(`NonConformite ${id} not found`);
    return NonConformiteDto.from(nc);
  }
}
