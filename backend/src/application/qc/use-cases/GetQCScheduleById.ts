import { IQCScheduleRepository } from '../../../domain/qc/repositories/IQCScheduleRepository';
import { QCScheduleDto } from '../dto/QCScheduleDto';

export class GetQCScheduleById {
  constructor(private readonly repo: IQCScheduleRepository) {}

  async execute(id: string): Promise<QCScheduleDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new Error(`QCSchedule ${id} not found`);
    return QCScheduleDto.from(entity);
  }
}
