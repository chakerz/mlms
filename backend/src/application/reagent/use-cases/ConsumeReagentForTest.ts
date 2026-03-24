import { IReagentRepository } from '../../../domain/reagent/repositories/IReagentRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { AuditService } from '../../common/services/AuditService';
import { ConsumeReagentDto } from '../dto/ConsumeReagentDto';
import { ReagentLotDto } from '../dto/ReagentLotDto';

export class ConsumeReagentForTest {
  constructor(
    private readonly repo: IReagentRepository,
    private readonly audit: AuditService,
  ) {}

  async execute(dto: ConsumeReagentDto, actorUserId?: string): Promise<ReagentLotDto> {
    const lot = await this.repo.findLotById(dto.lotId);
    if (!lot) throw new DomainNotFoundException('ReagentLot', dto.lotId);

    if (lot.isBlocked) {
      throw new DomainValidationException('Lot is blocked and cannot be consumed.');
    }
    if (lot.isExpired) {
      throw new DomainValidationException('Lot is expired and cannot be consumed.');
    }
    if (lot.currentQuantity < dto.quantity) {
      throw new DomainValidationException(
        `Insufficient quantity. Available: ${lot.currentQuantity}, requested: ${dto.quantity}.`,
      );
    }

    const newQuantity = lot.currentQuantity - dto.quantity;
    const updated = await this.repo.updateLotQuantity(dto.lotId, newQuantity);

    await this.audit.log({
      action: 'REAGENT_CONSUMED',
      entityType: 'ReagentLot',
      entityId: dto.lotId,
      actorUserId,
      afterJson: { testCode: dto.testCode, quantity: dto.quantity, newQuantity },
    });

    return ReagentLotDto.from(updated);
  }
}
