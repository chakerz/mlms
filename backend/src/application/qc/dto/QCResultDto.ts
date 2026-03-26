import { QCResult } from '../../../domain/qc/entities/QCResult';

export class QCResultDto {
  id: string;
  qcScheduleId: string | null;
  testId: string | null;
  testName: string;
  controlMaterialId: string | null;
  resultValue: string | null;
  performedDate: string;
  performedBy: string | null;
  status: string;
  acceptableLimitLow: number;
  acceptableLimitHigh: number;
  warningLimitLow: number;
  warningLimitHigh: number;
  qualitativeObservation: string | null;
  alert: string;
  comments: string | null;
  createdAt: string;
  updatedAt: string;

  static from(r: QCResult): QCResultDto {
    const dto = new QCResultDto();
    dto.id = r.id;
    dto.qcScheduleId = r.qcScheduleId;
    dto.testId = r.testId;
    dto.testName = r.testName;
    dto.controlMaterialId = r.controlMaterialId;
    dto.resultValue = r.resultValue;
    dto.performedDate = r.performedDate.toISOString();
    dto.performedBy = r.performedBy;
    dto.status = r.status;
    dto.acceptableLimitLow = r.acceptableLimitLow;
    dto.acceptableLimitHigh = r.acceptableLimitHigh;
    dto.warningLimitLow = r.warningLimitLow;
    dto.warningLimitHigh = r.warningLimitHigh;
    dto.qualitativeObservation = r.qualitativeObservation;
    dto.alert = r.alert;
    dto.comments = r.comments;
    dto.createdAt = r.createdAt.toISOString();
    dto.updatedAt = r.updatedAt.toISOString();
    return dto;
  }
}

export class CreateQCResultDto {
  qcScheduleId?: string;
  testId?: string;
  testName: string;
  controlMaterialId?: string;
  resultValue?: string;
  performedDate: string;
  performedBy?: string;
  status?: string;
  acceptableLimitLow?: number;
  acceptableLimitHigh?: number;
  warningLimitLow?: number;
  warningLimitHigh?: number;
  qualitativeObservation?: string;
  alert?: string;
  comments?: string;
}

export class UpdateQCResultDto {
  resultValue?: string;
  performedBy?: string;
  status?: string;
  qualitativeObservation?: string;
  alert?: string;
  comments?: string;
}
