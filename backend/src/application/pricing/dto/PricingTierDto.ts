import { PricingTier } from '../../../domain/pricing/entities/PricingTier';

export class PricingTierDto {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  defaultRate: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  static from(t: PricingTier): PricingTierDto {
    const dto = new PricingTierDto();
    dto.id = t.id;
    dto.name = t.name;
    dto.description = t.description;
    dto.isActive = t.isActive;
    dto.defaultRate = t.defaultRate;
    dto.notes = t.notes;
    dto.createdAt = t.createdAt.toISOString();
    dto.updatedAt = t.updatedAt.toISOString();
    return dto;
  }
}

export class CreatePricingTierDto {
  name: string;
  description?: string;
  isActive?: boolean;
  defaultRate?: number;
  notes?: string;
}

export class UpdatePricingTierDto {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  defaultRate?: number;
  notes?: string | null;
}
