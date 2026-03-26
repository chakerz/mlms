import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPractitionerRepository, ListPractitionersQuery } from '../../../domain/practitioner/repositories/IPractitionerRepository';
import { Practitioner } from '../../../domain/practitioner/entities/Practitioner';

type PrismaPractitionerRow = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  speciality: string | null;
  qualification: string | null;
  licenseNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PractitionerPrismaRepository implements IPractitionerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Practitioner | null> {
    const row = await this.prisma.practitioner.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(practitioner: Practitioner): Promise<Practitioner> {
    const row = await this.prisma.practitioner.create({
      data: {
        fullName: practitioner.fullName,
        email: practitioner.email,
        phoneNumber: practitioner.phoneNumber,
        address: practitioner.address,
        speciality: practitioner.speciality,
        qualification: practitioner.qualification,
        licenseNumber: practitioner.licenseNumber,
        isActive: practitioner.isActive,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<Practitioner>): Promise<Practitioner> {
    const row = await this.prisma.practitioner.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.speciality !== undefined && { speciality: data.speciality }),
        ...(data.qualification !== undefined && { qualification: data.qualification }),
        ...(data.licenseNumber !== undefined && { licenseNumber: data.licenseNumber }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return this.toDomain(row);
  }

  async list(query: ListPractitionersQuery): Promise<{ practitioners: Practitioner[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (query.search) {
      where['OR'] = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { speciality: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.speciality) where['speciality'] = { contains: query.speciality, mode: 'insensitive' };
    if (query.isActive !== undefined) where['isActive'] = query.isActive;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.practitioner.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { fullName: 'asc' },
      }),
      this.prisma.practitioner.count({ where }),
    ]);

    return { practitioners: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: PrismaPractitionerRow): Practitioner {
    return new Practitioner(
      row.id,
      row.fullName,
      row.email,
      row.phoneNumber,
      row.address,
      row.speciality,
      row.qualification,
      row.licenseNumber,
      row.isActive,
      row.createdAt,
      row.updatedAt,
    );
  }
}
