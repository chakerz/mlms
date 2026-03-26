import { IReportRepository } from '../../../domain/report/repositories/IReportRepository';
import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { ReportStatus } from '../../../domain/report/types/ReportStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { ReportDetailDto } from '../../report/dto/ReportDetailDto';
import { ReportDto } from '../../report/dto/ReportDto';
import { PatientDto } from '../../patient/dto/PatientDto';
import { OrderDto } from '../../order/dto/OrderDto';
import { ResultDto } from '../../result/dto/ResultDto';
import { Patient } from '../../../domain/patient/entities/Patient';

export class GetPortalReportById {
  constructor(
    private readonly reportRepo: IReportRepository,
    private readonly orderRepo: IOrderRepository,
    private readonly patientRepo: IPatientRepository,
    private readonly resultRepo: IResultRepository,
  ) {}

  async execute(id: string, email: string): Promise<ReportDetailDto> {
    const patient = await this.patientRepo.findByEmail(email);
    if (!patient) throw new DomainNotFoundException('Patient', email);

    const report = await this.reportRepo.findById(id);
    if (!report || report.status !== ReportStatus.PUBLISHED) {
      throw new DomainNotFoundException('Report', id);
    }

    const order = await this.orderRepo.findById(report.orderId);
    if (!order || order.patientId !== patient.id) {
      throw new DomainNotFoundException('Report', id);
    }

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
      bloodType: patient.bloodType ?? null,
      allergies: patient.allergies ?? null,
      emergencyContactName: patient.emergencyContactName ?? null,
      emergencyContactPhone: patient.emergencyContactPhone ?? null,
      healthInsuranceNumber: patient.healthInsuranceNumber ?? null,
      pricingTierId: patient.pricingTierId ?? null,
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }
}
