import { QCSchedule } from '../entities/QCSchedule';

export interface ListQCSchedulesQuery {
  page: number;
  pageSize: number;
  status?: string;
}

export interface IQCScheduleRepository {
  findById(id: string): Promise<QCSchedule | null>;
  save(schedule: QCSchedule): Promise<QCSchedule>;
  update(id: string, data: Partial<QCSchedule>): Promise<QCSchedule>;
  list(query: ListQCSchedulesQuery): Promise<{ schedules: QCSchedule[]; total: number }>;
}
