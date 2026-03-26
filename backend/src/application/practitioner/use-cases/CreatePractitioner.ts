import { IPractitionerRepository } from '../../../domain/practitioner/repositories/IPractitionerRepository';
import { Practitioner } from '../../../domain/practitioner/entities/Practitioner';
import { CreatePractitionerDto } from '../dto/CreatePractitionerDto';
import { PractitionerDto } from '../dto/PractitionerDto';

export class CreatePractitioner {
  constructor(private readonly practitionerRepo: IPractitionerRepository) {}

  async execute(dto: CreatePractitionerDto): Promise<PractitionerDto> {
    const practitioner = new Practitioner(
      '',
      dto.fullName,
      dto.email,
      dto.phoneNumber ?? null,
      dto.address ?? null,
      dto.speciality ?? null,
      dto.qualification ?? null,
      dto.licenseNumber ?? null,
      dto.isActive ?? true,
      new Date(),
      new Date(),
    );

    const saved = await this.practitionerRepo.save(practitioner);
    return PractitionerDto.from(saved);
  }
}
