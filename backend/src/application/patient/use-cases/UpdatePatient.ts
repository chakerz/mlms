import { Injectable, NotFoundException } from '@nestjs/common';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { Patient } from '../../../domain/patient/entities/Patient';
import { UpdatePatientDto } from '../dto/UpdatePatientDto';
import { PatientDto } from '../dto/PatientDto';

@Injectable()
export class UpdatePatient {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(id: string, dto: UpdatePatientDto): Promise<PatientDto> {
    const existing = await this.patientRepository.findById(id);
    if (!existing) throw new NotFoundException(`Patient ${id} not found`);

    const updated = new Patient(
      existing.id,
      dto.firstName ?? existing.firstName,
      dto.lastName ?? existing.lastName,
      dto.birthDate ? new Date(dto.birthDate) : existing.birthDate,
      dto.gender ?? existing.gender,
      dto.phone !== undefined ? dto.phone : existing.phone,
      dto.email !== undefined ? dto.email : existing.email,
      dto.address !== undefined ? dto.address : existing.address,
      existing.createdAt,
      new Date(),
      dto.bloodType !== undefined ? dto.bloodType : existing.bloodType,
      dto.allergies !== undefined ? dto.allergies : existing.allergies,
      dto.emergencyContactName !== undefined ? dto.emergencyContactName : existing.emergencyContactName,
      dto.emergencyContactPhone !== undefined ? dto.emergencyContactPhone : existing.emergencyContactPhone,
      dto.healthInsuranceNumber !== undefined ? dto.healthInsuranceNumber : existing.healthInsuranceNumber,
      dto.pricingTierId !== undefined ? dto.pricingTierId : existing.pricingTierId,
    );

    const saved = await this.patientRepository.save(updated);
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
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactPhone: patient.emergencyContactPhone,
      healthInsuranceNumber: patient.healthInsuranceNumber,
      pricingTierId: patient.pricingTierId,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }
}
