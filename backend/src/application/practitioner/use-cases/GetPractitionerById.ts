import { IPractitionerRepository } from '../../../domain/practitioner/repositories/IPractitionerRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { PractitionerDto } from '../dto/PractitionerDto';

export class GetPractitionerById {
  constructor(private readonly practitionerRepo: IPractitionerRepository) {}

  async execute(id: string): Promise<PractitionerDto> {
    const practitioner = await this.practitionerRepo.findById(id);
    if (!practitioner) throw new DomainNotFoundException('Practitioner', id);
    return PractitionerDto.from(practitioner);
  }
}
