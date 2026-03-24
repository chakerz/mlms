import { INonConformiteRepository } from '../../../domain/non-conformite/repositories/INonConformiteRepository';
import { NonConformiteDto } from '../dto/NonConformiteDto';

export class ListNonConformitesBySpecimen {
  constructor(private readonly repo: INonConformiteRepository) {}

  async execute(specimenId: string): Promise<NonConformiteDto[]> {
    const list = await this.repo.findBySpecimen(specimenId);
    return list.map(NonConformiteDto.from);
  }
}
