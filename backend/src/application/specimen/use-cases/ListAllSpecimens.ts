import { Injectable } from '@nestjs/common';
import { ISpecimenRepository } from '../../../domain/specimen/repositories/ISpecimenRepository';
import { SpecimenDto } from '../dto/SpecimenDto';

export interface ListAllSpecimensResult {
  data: SpecimenDto[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class ListAllSpecimens {
  constructor(private readonly specimenRepo: ISpecimenRepository) {}

  async execute(page: number, pageSize: number): Promise<ListAllSpecimensResult> {
    const { specimens, total } = await this.specimenRepo.listAll(page, pageSize);
    return {
      data: specimens.map(SpecimenDto.from),
      total,
      page,
      pageSize,
    };
  }
}
