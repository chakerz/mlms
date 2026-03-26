import { QCSchedule } from '../../../domain/qc/entities/QCSchedule';

export class QCScheduleDto {
  id: string;
  barcode: string;
  qcRuleName: string;
  scheduledDate: string;
  duration: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  static from(s: QCSchedule): QCScheduleDto {
    const dto = new QCScheduleDto();
    dto.id = s.id;
    dto.barcode = s.barcode;
    dto.qcRuleName = s.qcRuleName;
    dto.scheduledDate = s.scheduledDate.toISOString();
    dto.duration = s.duration;
    dto.status = s.status;
    dto.createdAt = s.createdAt.toISOString();
    dto.updatedAt = s.updatedAt.toISOString();
    return dto;
  }
}

export class CreateQCScheduleDto {
  barcode: string;
  qcRuleName: string;
  scheduledDate: string;
  duration?: number;
  status?: string;
}

export class UpdateQCScheduleDto {
  qcRuleName?: string;
  scheduledDate?: string;
  duration?: number;
  status?: string;
}
