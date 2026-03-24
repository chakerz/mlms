import { ISpecimenRepository } from '../../../domain/specimen/repositories/ISpecimenRepository';
import { SpecimenDto } from '../dto/SpecimenDto';

export class ListSpecimensByOrder {
  constructor(private readonly specimenRepo: ISpecimenRepository) {}

  async execute(orderId: string): Promise<SpecimenDto[]> {
    const specimens = await this.specimenRepo.findByOrderId(orderId);
    return specimens.map(SpecimenDto.from);
  }
}
