import { IQCScheduleRepository } from '../../../domain/qc/repositories/IQCScheduleRepository';
import { UpdateQCScheduleDto, QCScheduleDto } from '../dto/QCScheduleDto';

export class UpdateQCSchedule {
  constructor(private readonly repo: IQCScheduleRepository) {}

  async execute(id: string, dto: UpdateQCScheduleDto): Promise<QCScheduleDto> {
    const data: Record<string, unknown> = { ...dto };
    if (dto.scheduledDate) data['scheduledDate'] = new Date(dto.scheduledDate);
    const updated = await this.repo.update(id, data as never);
    return QCScheduleDto.from(updated);
  }
}
