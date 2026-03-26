import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IQCMaterialRepository, ListQCMaterialsQuery } from '../../../domain/qc/repositories/IQCMaterialRepository';
import { QCMaterial } from '../../../domain/qc/entities/QCMaterial';

@Injectable()
export class QCMaterialPrismaRepository implements IQCMaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QCMaterial | null> {
    const row = await this.prisma.qCMaterial.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(material: QCMaterial): Promise<QCMaterial> {
    const row = await this.prisma.qCMaterial.create({
      data: {
        barcode: material.barcode,
        name: material.name,
        lotNumber: material.lotNumber,
        manufacturer: material.manufacturer,
        expirationDate: material.expirationDate,
        expectedValue: material.expectedValue,
        standardDeviation: material.standardDeviation,
        isActive: material.isActive,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<QCMaterial>): Promise<QCMaterial> {
    const row = await this.prisma.qCMaterial.update({ where: { id }, data });
    return this.toDomain(row);
  }

  async list(query: ListQCMaterialsQuery): Promise<{ materials: QCMaterial[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.search) {
      where['OR'] = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { manufacturer: { contains: query.search, mode: 'insensitive' } },
        { lotNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where['isActive'] = query.isActive;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.qCMaterial.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.qCMaterial.count({ where }),
    ]);
    return { materials: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string; barcode: string; name: string; lotNumber: string; manufacturer: string;
    expirationDate: Date; expectedValue: number; standardDeviation: number;
    isActive: boolean; createdAt: Date; updatedAt: Date;
  }): QCMaterial {
    return new QCMaterial(row.id, row.barcode, row.name, row.lotNumber, row.manufacturer,
      row.expirationDate, row.expectedValue, row.standardDeviation,
      row.isActive, row.createdAt, row.updatedAt);
  }
}
