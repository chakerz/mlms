import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, PRICING_TIER_REPOSITORY } from './persistence.module';
import { IPricingTierRepository } from '../domain/pricing/repositories/IPricingTierRepository';
import { CreatePricingTier } from '../application/pricing/use-cases/CreatePricingTier';
import { GetPricingTierById } from '../application/pricing/use-cases/GetPricingTierById';
import { ListPricingTiers } from '../application/pricing/use-cases/ListPricingTiers';
import { UpdatePricingTier } from '../application/pricing/use-cases/UpdatePricingTier';
import { PricingTierController } from '../interfaces/http/controllers/PricingTierController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    { provide: CreatePricingTier, useFactory: (r: IPricingTierRepository) => new CreatePricingTier(r), inject: [PRICING_TIER_REPOSITORY] },
    { provide: GetPricingTierById, useFactory: (r: IPricingTierRepository) => new GetPricingTierById(r), inject: [PRICING_TIER_REPOSITORY] },
    { provide: ListPricingTiers, useFactory: (r: IPricingTierRepository) => new ListPricingTiers(r), inject: [PRICING_TIER_REPOSITORY] },
    { provide: UpdatePricingTier, useFactory: (r: IPricingTierRepository) => new UpdatePricingTier(r), inject: [PRICING_TIER_REPOSITORY] },
  ],
  controllers: [PricingTierController],
})
export class PricingModule {}
