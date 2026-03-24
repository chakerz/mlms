import { ISpecimenRepository } from '../../../domain/specimen/repositories/ISpecimenRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { SpecimenDto } from '../dto/SpecimenDto';

export class GetSpecimenById {
  constructor(private readonly specimenRepo: ISpecimenRepository) {}

  async execute(id: string): Promise<SpecimenDto> {
    const specimen = await this.specimenRepo.findById(id);
    if (!specimen) throw new DomainNotFoundException('Specimen', id);
    return SpecimenDto.from(specimen);
  }
}
