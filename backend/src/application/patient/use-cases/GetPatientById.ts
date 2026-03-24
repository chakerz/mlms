import { Injectable } from '@nestjs/common';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { Patient } from '../../../domain/patient/entities/Patient';
import { PatientDto } from '../dto/PatientDto';

@Injectable()
export class GetPatientById {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(id: string): Promise<PatientDto> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new DomainNotFoundException('Patient', id);
    }
    return this.toDto(patient);
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
