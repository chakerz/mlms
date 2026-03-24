import { IReagentRepository } from '../../../domain/reagent/repositories/IReagentRepository';
import { Reagent } from '../../../domain/reagent/entities/Reagent';
import { CreateReagentDto } from '../dto/CreateReagentDto';
import { ReagentDto } from '../dto/ReagentDto';

export class CreateReagent {
  constructor(private readonly repo: IReagentRepository) {}

  async execute(dto: CreateReagentDto): Promise<ReagentDto> {
    const reagent = new Reagent(
      '',
      dto.name,
      dto.manufacturer,
      dto.catalogNumber ?? null,
      dto.category,
      dto.storageTemp ?? null,
      new Date(),
      new Date(),
    );
    const saved = await this.repo.save(reagent);
    return ReagentDto.from(saved);
  }
}
