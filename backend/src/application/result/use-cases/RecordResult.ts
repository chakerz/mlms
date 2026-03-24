import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { ISpecimenRepository } from '../../../domain/specimen/repositories/ISpecimenRepository';
import { Result } from '../../../domain/result/entities/Result';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { ConflictDomainException } from '../../../domain/common/exceptions/ConflictDomainException';
import { RecordResultDto } from '../dto/RecordResultDto';
import { ResultDto } from '../dto/ResultDto';

export class RecordResult {
  constructor(
    private readonly resultRepo: IResultRepository,
    private readonly specimenRepo: ISpecimenRepository,
  ) {}

  async execute(dto: RecordResultDto, measuredBy: string | null): Promise<ResultDto> {
    const specimen = await this.specimenRepo.findById(dto.specimenId);
    if (!specimen) throw new DomainNotFoundException('Specimen', dto.specimenId);

    const existing = await this.resultRepo.findBySpecimenIdAndTestCode(
      dto.specimenId,
      dto.testCode,
    );
    if (existing) {
      throw new ConflictDomainException(
        `Result for test ${dto.testCode} already exists on specimen ${dto.specimenId}`,
      );
    }

    const result = new Result(
      '',
      dto.specimenId,
      dto.testCode,
      dto.testNameFr,
      dto.testNameAr,
      dto.value,
      dto.unit ?? null,
      dto.referenceLow ?? null,
      dto.referenceHigh ?? null,
      dto.flag,
      new Date(dto.measuredAt),
      measuredBy,
      new Date(),
      new Date(),
    );

    const saved = await this.resultRepo.save(result);
    return ResultDto.from(saved);
  }
}
