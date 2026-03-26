import { PricingTier } from '../entities/PricingTier';

export interface ListPricingTiersQuery {
  page: number;
  pageSize: number;
  isActive?: boolean;
}

export interface IPricingTierRepository {
  findById(id: string): Promise<PricingTier | null>;
  findAll(): Promise<PricingTier[]>;
  save(tier: PricingTier): Promise<PricingTier>;
  update(id: string, data: Partial<PricingTier>): Promise<PricingTier>;
  list(query: ListPricingTiersQuery): Promise<{ tiers: PricingTier[]; total: number }>;
}
