import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { INonConformiteRepository } from '../../../domain/non-conformite/repositories/INonConformiteRepository';
import { NonConformite } from '../../../domain/non-conformite/entities/NonConformite';
import { NonConformiteReason } from '../../../domain/non-conformite/types/NonConformiteReason';
import { ConformiteAction } from '../../../domain/non-conformite/types/ConformiteAction';

type PrismaNonConformiteRow = {
  id: string;
  specimenId: string | null;
  orderId: string | null;
  reason: string;
  details: string | null;
  action: string;
  recordedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class NonConformitePrismaRepository implements INonConformiteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<NonConformite | null> {
    const row = await this.prisma.nonConformite.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findBySpecimen(specimenId: string): Promise<NonConformite[]> {
    const rows = await this.prisma.nonConformite.findMany({
      where: { specimenId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByOrder(orderId: string): Promise<NonConformite[]> {
    const rows = await this.prisma.nonConformite.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async list(page: number, pageSize: number): Promise<{ data: NonConformite[]; total: number }> {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.nonConformite.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.nonConformite.count(),
    ]);
    return { data: rows.map((r) => this.toDomain(r)), total };
  }

  async save(nc: NonConformite): Promise<NonConformite> {
    const data = {
      specimenId: nc.specimenId,
      orderId: nc.orderId,
      reason: nc.reason as unknown as import('@prisma/client').NonConformiteReason,
      details: nc.details,
      action: nc.action as unknown as import('@prisma/client').ConformiteAction,
      recordedBy: nc.recordedBy,
    };

    const row = nc.id
      ? await this.prisma.nonConformite.update({ where: { id: nc.id }, data })
      : await this.prisma.nonConformite.create({ data });

    return this.toDomain(row);
  }

  private toDomain(row: PrismaNonConformiteRow): NonConformite {
    return new NonConformite(
      row.id,
      row.specimenId,
      row.orderId,
      row.reason as NonConformiteReason,
      row.details,
      row.action as ConformiteAction,
      row.recordedBy,
      row.createdAt,
      row.updatedAt,
    );
  }
}
