import { IPricingTierRepository } from '../../../domain/pricing/repositories/IPricingTierRepository';
import { PricingTierDto } from '../dto/PricingTierDto';

export class ListPricingTiers {
  constructor(private readonly repo: IPricingTierRepository) {}

  async execute(req: { page?: number; pageSize?: number; isActive?: string }) {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 50;
    const { tiers, total } = await this.repo.list({
      page, pageSize,
      isActive: req.isActive !== undefined ? req.isActive === 'true' : undefined,
    });
    return { data: tiers.map(PricingTierDto.from), total, page, pageSize };
  }
}
