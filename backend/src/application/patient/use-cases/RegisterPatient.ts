import { Injectable } from '@nestjs/common';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { Patient } from '../../../domain/patient/entities/Patient';
import { RegisterPatientDto } from '../dto/RegisterPatientDto';
import { PatientDto } from '../dto/PatientDto';

@Injectable()
export class RegisterPatient {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(dto: RegisterPatientDto): Promise<PatientDto> {
    const patient = new Patient(
      '',
      dto.firstName,
      dto.lastName,
      new Date(dto.birthDate),
      dto.gender,
      dto.phone ?? null,
      dto.email ?? null,
      dto.address ?? null,
      new Date(),
      new Date(),
    );
    const saved = await this.patientRepository.save(patient);
    return this.toDto(saved);
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
