import { IReportRepository } from '../../../domain/report/repositories/IReportRepository';
import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { Patient } from '../../../domain/patient/entities/Patient';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { ReportDto } from '../dto/ReportDto';
import { ReportDetailDto } from '../dto/ReportDetailDto';
import { PatientDto } from '../../patient/dto/PatientDto';
import { OrderDto } from '../../order/dto/OrderDto';
import { ResultDto } from '../../result/dto/ResultDto';

export class GetReportById {
  constructor(
    private readonly reportRepo: IReportRepository,
    private readonly orderRepo: IOrderRepository,
    private readonly patientRepo: IPatientRepository,
    private readonly resultRepo: IResultRepository,
  ) {}

  async execute(id: string): Promise<ReportDetailDto> {
    const report = await this.reportRepo.findById(id);
    if (!report) throw new DomainNotFoundException('Report', id);

    const order = await this.orderRepo.findById(report.orderId);
    if (!order) throw new DomainNotFoundException('Order', report.orderId);

    const patient = await this.patientRepo.findById(order.patientId);
    if (!patient) throw new DomainNotFoundException('Patient', order.patientId);

    const results = await this.resultRepo.findByOrderId(report.orderId);

    const detail = new ReportDetailDto();
    detail.report = ReportDto.from(report);
    detail.patient = this.toPatientDto(patient);
    detail.order = OrderDto.from(order);
    detail.results = results.map(ResultDto.from);
    return detail;
  }

  private toPatientDto(patient: Patient): PatientDto {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate.toISOString(),
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }
}
