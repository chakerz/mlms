import { ReportStatus } from '../types/ReportStatus';

export class Report {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly status: ReportStatus,
    public readonly commentsFr: string | null,
    public readonly commentsAr: string | null,
    public readonly validatedBy: string | null,
    public readonly validatedAt: Date | null,
    public readonly signedBy: string | null,
    public readonly signedAt: Date | null,
    public readonly publishedAt: Date | null,
    public readonly templateVersion: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
