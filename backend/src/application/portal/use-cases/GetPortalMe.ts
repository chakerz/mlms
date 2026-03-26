import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { PatientDto } from '../../patient/dto/PatientDto';

export class GetPortalMe {
  constructor(private readonly patientRepo: IPatientRepository) {}

  async execute(email: string): Promise<PatientDto> {
    const patient = await this.patientRepo.findByEmail(email);
    if (!patient) throw new DomainNotFoundException('Patient', email);
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate.toISOString(),
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodType: patient.bloodType ?? null,
      allergies: patient.allergies ?? null,
      emergencyContactName: patient.emergencyContactName ?? null,
      emergencyContactPhone: patient.emergencyContactPhone ?? null,
      healthInsuranceNumber: patient.healthInsuranceNumber ?? null,
      pricingTierId: patient.pricingTierId ?? null,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }
}
