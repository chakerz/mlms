import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPricingTierRepository, ListPricingTiersQuery } from '../../../domain/pricing/repositories/IPricingTierRepository';
import { PricingTier } from '../../../domain/pricing/entities/PricingTier';

@Injectable()
export class PricingTierPrismaRepository implements IPricingTierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PricingTier | null> {
    const row = await this.prisma.pricingTier.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<PricingTier[]> {
    const rows = await this.prisma.pricingTier.findMany({ orderBy: { name: 'asc' } });
    return rows.map((r) => this.toDomain(r));
  }

  async save(tier: PricingTier): Promise<PricingTier> {
    const row = await this.prisma.pricingTier.create({
      data: { name: tier.name, description: tier.description, isActive: tier.isActive, defaultRate: tier.defaultRate, notes: tier.notes },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<PricingTier>): Promise<PricingTier> {
    const row = await this.prisma.pricingTier.update({ where: { id }, data });
    return this.toDomain(row);
  }

  async list(query: ListPricingTiersQuery): Promise<{ tiers: PricingTier[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.isActive !== undefined) where['isActive'] = query.isActive;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.pricingTier.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { name: 'asc' },
      }),
      this.prisma.pricingTier.count({ where }),
    ]);
    return { tiers: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string; name: string; description: string | null; isActive: boolean;
    defaultRate: number; notes: string | null; createdAt: Date; updatedAt: Date;
  }): PricingTier {
    return new PricingTier(row.id, row.name, row.description, row.isActive, row.defaultRate, row.notes, row.createdAt, row.updatedAt);
  }
}
