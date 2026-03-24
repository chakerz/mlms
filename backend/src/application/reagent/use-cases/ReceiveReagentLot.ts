import { IReagentRepository } from '../../../domain/reagent/repositories/IReagentRepository';
import { ReagentLot } from '../../../domain/reagent/entities/ReagentLot';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { ReceiveReagentLotDto } from '../dto/ReceiveReagentLotDto';
import { ReagentLotDto } from '../dto/ReagentLotDto';

export class ReceiveReagentLot {
  constructor(private readonly repo: IReagentRepository) {}

  async execute(dto: ReceiveReagentLotDto): Promise<ReagentLotDto> {
    const reagent = await this.repo.findById(dto.reagentId);
    if (!reagent) throw new DomainNotFoundException('Reagent', dto.reagentId);

    const lot = new ReagentLot(
      '',
      dto.reagentId,
      dto.lotNumber,
      new Date(dto.expiryDate),
      dto.initialQuantity,
      dto.initialQuantity,
      false,
      dto.storageLocation ?? null,
      new Date(),
      new Date(),
    );
    const saved = await this.repo.saveLot(lot);
    return ReagentLotDto.from(saved);
  }
}
