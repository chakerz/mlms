import { IQCScheduleRepository } from '../../../domain/qc/repositories/IQCScheduleRepository';
import { QCSchedule } from '../../../domain/qc/entities/QCSchedule';
import { CreateQCScheduleDto, QCScheduleDto } from '../dto/QCScheduleDto';

export class CreateQCSchedule {
  constructor(private readonly repo: IQCScheduleRepository) {}

  async execute(dto: CreateQCScheduleDto): Promise<QCScheduleDto> {
    const entity = new QCSchedule('', dto.barcode, dto.qcRuleName,
      new Date(dto.scheduledDate), dto.duration ?? 60, dto.status ?? 'PENDING', new Date(), new Date());
    const saved = await this.repo.save(entity);
    return QCScheduleDto.from(saved);
  }
}
