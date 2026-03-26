import { IPricingTierRepository } from '../../../domain/pricing/repositories/IPricingTierRepository';
import { PricingTier } from '../../../domain/pricing/entities/PricingTier';
import { CreatePricingTierDto, PricingTierDto } from '../dto/PricingTierDto';

export class CreatePricingTier {
  constructor(private readonly repo: IPricingTierRepository) {}

  async execute(dto: CreatePricingTierDto): Promise<PricingTierDto> {
    const entity = new PricingTier('', dto.name, dto.description ?? null,
      dto.isActive ?? true, dto.defaultRate ?? 0, dto.notes ?? null, new Date(), new Date());
    const saved = await this.repo.save(entity);
    return PricingTierDto.from(saved);
  }
}
