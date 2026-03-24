import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { ResultDto } from '../dto/ResultDto';

export class ListResultsBySpecimen {
  constructor(private readonly resultRepo: IResultRepository) {}

  async execute(specimenId: string): Promise<ResultDto[]> {
    const results = await this.resultRepo.findBySpecimenId(specimenId);
    return results.map(ResultDto.from);
  }
}
