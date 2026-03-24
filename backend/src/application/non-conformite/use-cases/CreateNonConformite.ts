import { BadRequestException } from '@nestjs/common';
import { INonConformiteRepository } from '../../../domain/non-conformite/repositories/INonConformiteRepository';
import { NonConformite } from '../../../domain/non-conformite/entities/NonConformite';
import { CreateNonConformiteDto } from '../dto/CreateNonConformiteDto';
import { NonConformiteDto } from '../dto/NonConformiteDto';

export class CreateNonConformite {
  constructor(private readonly repo: INonConformiteRepository) {}

  async execute(dto: CreateNonConformiteDto, recordedBy: string | null): Promise<NonConformiteDto> {
    if (!dto.specimenId && !dto.orderId) {
      throw new BadRequestException('Either specimenId or orderId must be provided');
    }

    const now = new Date();
    const nc = new NonConformite(
      '',
      dto.specimenId ?? null,
      dto.orderId ?? null,
      dto.reason,
      dto.details ?? null,
      dto.action,
      recordedBy,
      now,
      now,
    );

    const saved = await this.repo.save(nc);
    return NonConformiteDto.from(saved);
  }
}
