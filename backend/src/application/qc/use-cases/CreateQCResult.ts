import { IQCResultRepository } from '../../../domain/qc/repositories/IQCResultRepository';
import { QCResult } from '../../../domain/qc/entities/QCResult';
import { CreateQCResultDto, QCResultDto } from '../dto/QCResultDto';

export class CreateQCResult {
  constructor(private readonly repo: IQCResultRepository) {}

  async execute(dto: CreateQCResultDto): Promise<QCResultDto> {
    const entity = new QCResult('', dto.qcScheduleId ?? null, dto.testId ?? null, dto.testName,
      dto.controlMaterialId ?? null, dto.resultValue ?? null, new Date(dto.performedDate),
      dto.performedBy ?? null, dto.status ?? 'PENDING',
      dto.acceptableLimitLow ?? 0, dto.acceptableLimitHigh ?? 0,
      dto.warningLimitLow ?? 0, dto.warningLimitHigh ?? 0,
      dto.qualitativeObservation ?? null, dto.alert ?? 'GRAY', dto.comments ?? null,
      new Date(), new Date());
    const saved = await this.repo.save(entity);
    return QCResultDto.from(saved);
  }
}
