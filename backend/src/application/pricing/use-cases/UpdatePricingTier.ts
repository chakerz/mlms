import { IPricingTierRepository } from '../../../domain/pricing/repositories/IPricingTierRepository';
import { UpdatePricingTierDto, PricingTierDto } from '../dto/PricingTierDto';

export class UpdatePricingTier {
  constructor(private readonly repo: IPricingTierRepository) {}

  async execute(id: string, dto: UpdatePricingTierDto): Promise<PricingTierDto> {
    const updated = await this.repo.update(id, dto as never);
    return PricingTierDto.from(updated);
  }
}
