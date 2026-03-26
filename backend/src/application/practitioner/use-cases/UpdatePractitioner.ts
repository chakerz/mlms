import { IPractitionerRepository } from '../../../domain/practitioner/repositories/IPractitionerRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { UpdatePractitionerDto } from '../dto/UpdatePractitionerDto';
import { PractitionerDto } from '../dto/PractitionerDto';

export class UpdatePractitioner {
  constructor(private readonly practitionerRepo: IPractitionerRepository) {}

  async execute(id: string, dto: UpdatePractitionerDto): Promise<PractitionerDto> {
    const existing = await this.practitionerRepo.findById(id);
    if (!existing) throw new DomainNotFoundException('Practitioner', id);

    const updated = await this.practitionerRepo.update(id, {
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber !== undefined ? dto.phoneNumber : undefined,
      address: dto.address !== undefined ? dto.address : undefined,
      speciality: dto.speciality !== undefined ? dto.speciality : undefined,
      qualification: dto.qualification !== undefined ? dto.qualification : undefined,
      licenseNumber: dto.licenseNumber !== undefined ? dto.licenseNumber : undefined,
      isActive: dto.isActive,
    } as Partial<import('../../../domain/practitioner/entities/Practitioner').Practitioner>);

    return PractitionerDto.from(updated);
  }
}
