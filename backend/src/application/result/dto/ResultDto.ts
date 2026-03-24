import { Result } from '../../../domain/result/entities/Result';

export class ResultDto {
  id: string;
  specimenId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  flag: string;
  measuredAt: string;
  measuredBy: string | null;
  createdAt: string;
  updatedAt: string;

  static from(r: Result): ResultDto {
    const dto = new ResultDto();
    dto.id = r.id;
    dto.specimenId = r.specimenId;
    dto.testCode = r.testCode;
    dto.testNameFr = r.testNameFr;
    dto.testNameAr = r.testNameAr;
    dto.value = r.value;
    dto.unit = r.unit;
    dto.referenceLow = r.referenceLow;
    dto.referenceHigh = r.referenceHigh;
    dto.flag = r.flag;
    dto.measuredAt = r.measuredAt.toISOString();
    dto.measuredBy = r.measuredBy;
    dto.createdAt = r.createdAt.toISOString();
    dto.updatedAt = r.updatedAt.toISOString();
    return dto;
  }
}
