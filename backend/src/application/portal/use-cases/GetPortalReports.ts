import { IReportRepository } from '../../../domain/report/repositories/IReportRepository';
import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { ReportStatus } from '../../../domain/report/types/ReportStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { ReportDto } from '../../report/dto/ReportDto';

export class GetPortalReports {
  constructor(
    private readonly reportRepo: IReportRepository,
    private readonly orderRepo: IOrderRepository,
    private readonly patientRepo: IPatientRepository,
  ) {}

  async execute(
    email: string,
    page: number,
    pageSize: number,
  ): Promise<{ data: ReportDto[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    const patient = await this.patientRepo.findByEmail(email);
    if (!patient) throw new DomainNotFoundException('Patient', email);

    const { orders } = await this.orderRepo.list({ patientId: patient.id, page: 1, pageSize: 500 });

    const publishedReports: ReportDto[] = [];
    for (const order of orders) {
      const reports = await this.reportRepo.findByOrderId(order.id);
      for (const r of reports) {
        if (r.status === ReportStatus.PUBLISHED) {
          publishedReports.push(ReportDto.from(r));
        }
      }
    }

    publishedReports.sort((a, b) =>
      (b.publishedAt ?? b.createdAt) > (a.publishedAt ?? a.createdAt) ? 1 : -1,
    );

    const total = publishedReports.length;
    const start = (page - 1) * pageSize;
    const data = publishedReports.slice(start, start + pageSize);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }
}
