import { IReagentRepository } from '../../../domain/reagent/repositories/IReagentRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { ReagentLotDto } from '../dto/ReagentLotDto';

export class ListReagentLots {
  constructor(private readonly repo: IReagentRepository) {}

  async execute(reagentId: string): Promise<ReagentLotDto[]> {
    const reagent = await this.repo.findById(reagentId);
    if (!reagent) throw new DomainNotFoundException('Reagent', reagentId);

    const lots = await this.repo.listLots(reagentId);
    return lots.map(ReagentLotDto.from);
  }
}
