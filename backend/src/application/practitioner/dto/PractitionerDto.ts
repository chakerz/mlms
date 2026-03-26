import { Practitioner } from '../../../domain/practitioner/entities/Practitioner';

export class PractitionerDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  speciality: string | null;
  qualification: string | null;
  licenseNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static from(practitioner: Practitioner): PractitionerDto {
    const dto = new PractitionerDto();
    dto.id = practitioner.id;
    dto.fullName = practitioner.fullName;
    dto.email = practitioner.email;
    dto.phoneNumber = practitioner.phoneNumber;
    dto.address = practitioner.address;
    dto.speciality = practitioner.speciality;
    dto.qualification = practitioner.qualification;
    dto.licenseNumber = practitioner.licenseNumber;
    dto.isActive = practitioner.isActive;
    dto.createdAt = practitioner.createdAt.toISOString();
    dto.updatedAt = practitioner.updatedAt.toISOString();
    return dto;
  }
}
