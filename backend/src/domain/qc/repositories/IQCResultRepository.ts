import { QCResult } from '../entities/QCResult';

export interface ListQCResultsQuery {
  page: number;
  pageSize: number;
  status?: string;
  alert?: string;
  qcScheduleId?: string;
}

export interface IQCResultRepository {
  findById(id: string): Promise<QCResult | null>;
  save(result: QCResult): Promise<QCResult>;
  update(id: string, data: Partial<QCResult>): Promise<QCResult>;
  list(query: ListQCResultsQuery): Promise<{ results: QCResult[]; total: number }>;
}
