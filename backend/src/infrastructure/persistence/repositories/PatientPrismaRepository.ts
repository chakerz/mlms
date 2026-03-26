import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { Patient } from '../../../domain/patient/entities/Patient';
import { Gender } from '../../../domain/common/types/Gender';

@Injectable()
export class PatientPrismaRepository implements IPatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Patient | null> {
    const row = await this.prisma.patient.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const row = await this.prisma.patient.findFirst({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async save(patient: Patient): Promise<Patient> {
    const data = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
      healthInsuranceNumber: patient.healthInsuranceNumber,
      pricingTierId: patient.pricingTierId,
    };
    const row = patient.id
      ? await this.prisma.patient.update({ where: { id: patient.id }, data })
      : await this.prisma.patient.create({ data });
    return this.toDomain(row);
  }

  async list(page: number, pageSize: number): Promise<{ patients: Patient[]; total: number }> {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.patient.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count(),
    ]);
    return { patients: rows.map((r) => this.toDomain(r)), total };
  }

  async search(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<{ patients: Patient[]; total: number }> {
    const where = {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' as const } },
        { lastName: { contains: query, mode: 'insensitive' as const } },
        { email: { contains: query, mode: 'insensitive' as const } },
        { phone: { contains: query, mode: 'insensitive' as const } },
        { address: { contains: query, mode: 'insensitive' as const } },
      ],
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.patient.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);
    return { patients: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
    bloodType?: string | null;
    allergies?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    healthInsuranceNumber?: string | null;
    pricingTierId?: string | null;
  }): Patient {
    return new Patient(
      row.id,
      row.firstName,
      row.lastName,
      row.birthDate,
      row.gender as Gender,
      row.phone,
      row.email,
      row.address,
      row.createdAt,
      row.updatedAt,
      row.bloodType ?? null,
      row.allergies ?? null,
      row.emergencyContactName ?? null,
      row.emergencyContactPhone ?? null,
      row.healthInsuranceNumber ?? null,
      row.pricingTierId ?? null,
    );
  }
}
