import { Injectable } from '@nestjs/common';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { Patient } from '../../../domain/patient/entities/Patient';
import { PatientDto } from '../dto/PatientDto';

export interface ListPatientsQuery {
  page?: number;
  pageSize?: number;
  query?: string;
}

@Injectable()
export class ListPatients {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(query: ListPatientsQuery): Promise<{
    data: PatientDto[];
    meta: { total: number; page: number; pageSize: number };
  }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    const result = query.query
      ? await this.patientRepository.search(query.query, page, pageSize)
      : await this.patientRepository.list(page, pageSize);

    return {
      data: result.patients.map((p) => this.toDto(p)),
      meta: { total: result.total, page, pageSize },
    };
  }

  private toDto(patient: Patient): PatientDto {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate.toISOString(),
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }
}
