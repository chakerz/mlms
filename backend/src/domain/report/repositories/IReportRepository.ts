import { Report } from '../entities/Report';
import { ReportStatus } from '../types/ReportStatus';

export interface UpdateReportData {
  status?: ReportStatus;
  commentsFr?: string | null;
  commentsAr?: string | null;
  validatedBy?: string | null;
  validatedAt?: Date | null;
  signedBy?: string | null;
  signedAt?: Date | null;
  publishedAt?: Date | null;
}

export interface ListReportsQuery {
  page: number;
  pageSize: number;
  status?: string;
  orderId?: string;
}

export interface IReportRepository {
  findById(id: string): Promise<Report | null>;
  findByOrderId(orderId: string): Promise<Report[]>;
  list(query: ListReportsQuery): Promise<{ data: Report[]; total: number }>;
  save(report: Report): Promise<Report>;
  update(id: string, data: UpdateReportData): Promise<Report>;
}
