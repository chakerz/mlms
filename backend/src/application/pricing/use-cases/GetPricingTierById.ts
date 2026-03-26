import { IPricingTierRepository } from '../../../domain/pricing/repositories/IPricingTierRepository';
import { PricingTierDto } from '../dto/PricingTierDto';

export class GetPricingTierById {
  constructor(private readonly repo: IPricingTierRepository) {}

  async execute(id: string): Promise<PricingTierDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new Error(`PricingTier ${id} not found`);
    return PricingTierDto.from(entity);
  }
}
