import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IReagentRepository, ListReagentsQuery } from '../../../domain/reagent/repositories/IReagentRepository';
import { Reagent } from '../../../domain/reagent/entities/Reagent';
import { ReagentLot } from '../../../domain/reagent/entities/ReagentLot';
import { ReagentCategory } from '../../../domain/reagent/types/ReagentCategory';

type PrismaReagentRow = {
  id: string;
  name: string;
  manufacturer: string;
  catalogNumber: string | null;
  category: string;
  storageTemp: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaLotRow = {
  id: string;
  reagentId: string;
  lotNumber: string;
  expiryDate: Date;
  initialQuantity: number;
  currentQuantity: number;
  isBlocked: boolean;
  storageLocation: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ReagentPrismaRepository implements IReagentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Reagent | null> {
    const row = await this.prisma.reagent.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(reagent: Reagent): Promise<Reagent> {
    const data = {
      name: reagent.name,
      manufacturer: reagent.manufacturer,
      catalogNumber: reagent.catalogNumber,
      category: reagent.category as unknown as import('@prisma/client').ReagentCategory,
      storageTemp: reagent.storageTemp,
    };

    if (reagent.id) {
      const row = await this.prisma.reagent.update({ where: { id: reagent.id }, data });
      return this.toDomain(row);
    }
    const row = await this.prisma.reagent.create({ data });
    return this.toDomain(row);
  }

  async list(query: ListReagentsQuery): Promise<{ reagents: Reagent[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.category) where['category'] = query.category;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.reagent.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { name: 'asc' },
      }),
      this.prisma.reagent.count({ where }),
    ]);
    return { reagents: rows.map((r) => this.toDomain(r)), total };
  }

  async findLotById(id: string): Promise<ReagentLot | null> {
    const row = await this.prisma.reagentLot.findUnique({ where: { id } });
    return row ? this.lotToDomain(row) : null;
  }

  async saveLot(lot: ReagentLot): Promise<ReagentLot> {
    const data = {
      reagentId: lot.reagentId,
      lotNumber: lot.lotNumber,
      expiryDate: lot.expiryDate,
      initialQuantity: lot.initialQuantity,
      currentQuantity: lot.currentQuantity,
      isBlocked: lot.isBlocked,
      storageLocation: lot.storageLocation,
    };

    if (lot.id) {
      const row = await this.prisma.reagentLot.update({ where: { id: lot.id }, data });
      return this.lotToDomain(row);
    }
    const row = await this.prisma.reagentLot.create({ data });
    return this.lotToDomain(row);
  }

  async listLots(reagentId: string): Promise<ReagentLot[]> {
    const rows = await this.prisma.reagentLot.findMany({
      where: { reagentId },
      orderBy: { expiryDate: 'asc' },
    });
    return rows.map((r) => this.lotToDomain(r));
  }

  async updateLotQuantity(id: string, newQuantity: number): Promise<ReagentLot> {
    const row = await this.prisma.reagentLot.update({
      where: { id },
      data: { currentQuantity: newQuantity },
    });
    return this.lotToDomain(row);
  }

  private toDomain(row: PrismaReagentRow): Reagent {
    return new Reagent(
      row.id,
      row.name,
      row.manufacturer,
      row.catalogNumber,
      row.category as ReagentCategory,
      row.storageTemp,
      row.createdAt,
      row.updatedAt,
    );
  }

  private lotToDomain(row: PrismaLotRow): ReagentLot {
    return new ReagentLot(
      row.id,
      row.reagentId,
      row.lotNumber,
      row.expiryDate,
      row.initialQuantity,
      row.currentQuantity,
      row.isBlocked,
      row.storageLocation,
      row.createdAt,
      row.updatedAt,
    );
  }
}
