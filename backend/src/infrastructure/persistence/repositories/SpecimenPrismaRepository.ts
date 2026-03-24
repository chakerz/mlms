import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISpecimenRepository } from '../../../domain/specimen/repositories/ISpecimenRepository';
import { Specimen } from '../../../domain/specimen/entities/Specimen';
import { SpecimenType } from '../../../domain/specimen/types/SpecimenType';
import { SpecimenStatus } from '../../../domain/specimen/types/SpecimenStatus';
import { ContainerType } from '../../../domain/specimen/types/ContainerType';

type PrismaSpecimenRow = {
  id: string;
  orderId: string;
  barcode: string;
  type: string;
  containerType: string | null;
  status: string;
  collectionTime: Date;
  preleveur: string | null;
  receivedAt: Date | null;
  receivedBy: string | null;
  sentAt: Date | null;
  transportConditions: string | null;
  conservedUntil: Date | null;
  conservationSite: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class SpecimenPrismaRepository implements ISpecimenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Specimen | null> {
    const row = await this.prisma.specimen.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByBarcode(barcode: string): Promise<Specimen | null> {
    const row = await this.prisma.specimen.findUnique({ where: { barcode } });
    return row ? this.toDomain(row) : null;
  }

  async findByOrderId(orderId: string): Promise<Specimen[]> {
    const rows = await this.prisma.specimen.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async listAll(page: number, pageSize: number): Promise<{ specimens: Specimen[]; total: number }> {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.specimen.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.specimen.count(),
    ]);
    return { specimens: rows.map((r) => this.toDomain(r)), total };
  }

  async save(specimen: Specimen): Promise<Specimen> {
    const data = {
      orderId: specimen.orderId,
      barcode: specimen.barcode,
      type: specimen.type as unknown as import('@prisma/client').SpecimenType,
      containerType: specimen.containerType as unknown as import('@prisma/client').ContainerType | null,
      status: specimen.status as unknown as import('@prisma/client').SpecimenStatus,
      collectionTime: specimen.collectionTime,
      preleveur: specimen.preleveur,
      receivedAt: specimen.receivedAt,
      receivedBy: specimen.receivedBy,
      sentAt: specimen.sentAt,
      transportConditions: specimen.transportConditions,
      conservedUntil: specimen.conservedUntil,
      conservationSite: specimen.conservationSite,
      notes: specimen.notes,
    };

    const row = specimen.id
      ? await this.prisma.specimen.update({ where: { id: specimen.id }, data })
      : await this.prisma.specimen.create({ data });

    return this.toDomain(row);
  }

  async updateStatus(id: string, status: SpecimenStatus, receivedAt?: Date): Promise<Specimen> {
    const data: Record<string, unknown> = {
      status: status as unknown as import('@prisma/client').SpecimenStatus,
    };
    if (receivedAt !== undefined) data['receivedAt'] = receivedAt;

    const row = await this.prisma.specimen.update({ where: { id }, data });
    return this.toDomain(row);
  }

  private toDomain(row: PrismaSpecimenRow): Specimen {
    return new Specimen(
      row.id,
      row.orderId,
      row.barcode,
      row.type as SpecimenType,
      row.containerType ? (row.containerType as ContainerType) : null,
      row.status as SpecimenStatus,
      row.collectionTime,
      row.preleveur,
      row.receivedAt,
      row.receivedBy,
      row.sentAt,
      row.transportConditions,
      row.conservedUntil,
      row.conservationSite,
      row.notes,
      row.createdAt,
      row.updatedAt,
    );
  }
}
