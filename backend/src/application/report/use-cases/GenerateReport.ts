import { IReportRepository } from '../../../domain/report/repositories/IReportRepository';
import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { Report } from '../../../domain/report/entities/Report';
import { ReportStatus } from '../../../domain/report/types/ReportStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { GenerateReportDto } from '../dto/GenerateReportDto';
import { ReportDto } from '../dto/ReportDto';

export class GenerateReport {
  constructor(
    private readonly reportRepo: IReportRepository,
    private readonly orderRepo: IOrderRepository,
    private readonly resultRepo: IResultRepository,
  ) {}

  async execute(dto: GenerateReportDto, createdBy?: string): Promise<ReportDto> {
    const order = await this.orderRepo.findById(dto.orderId);
    if (!order) throw new DomainNotFoundException('Order', dto.orderId);

    const results = await this.resultRepo.findByOrderId(dto.orderId);
    if (results.length === 0) {
      throw new DomainValidationException(
        'Cannot generate report: no results found for this order',
      );
    }

    const report = new Report(
      '',
      dto.orderId,
      ReportStatus.DRAFT,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      dto.templateVersion ?? 'v1',
      new Date(),
      new Date(),
    );

    const saved = await this.reportRepo.save(report);
    return ReportDto.from(saved);
  }
}
