import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { UpdateResultDto } from '../dto/UpdateResultDto';
import { ResultDto } from '../dto/ResultDto';

export class UpdateResult {
  constructor(private readonly resultRepo: IResultRepository) {}

  async execute(id: string, dto: UpdateResultDto): Promise<ResultDto> {
    const result = await this.resultRepo.findById(id);
    if (!result) throw new DomainNotFoundException('Result', id);

    const updated = await this.resultRepo.update(id, {
      value: dto.value,
      unit: dto.unit,
      referenceLow: dto.referenceLow,
      referenceHigh: dto.referenceHigh,
      flag: dto.flag,
      measuredAt: dto.measuredAt ? new Date(dto.measuredAt) : undefined,
    });

    return ResultDto.from(updated);
  }
}
