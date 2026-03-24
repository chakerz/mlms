import { Result } from '../entities/Result';
import { ResultFlag } from '../types/ResultFlag';

export interface UpdateResultData {
  value?: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag?: ResultFlag;
  measuredAt?: Date;
}

export interface IResultRepository {
  findById(id: string): Promise<Result | null>;
  findBySpecimenIdAndTestCode(specimenId: string, testCode: string): Promise<Result | null>;
  findBySpecimenId(specimenId: string): Promise<Result[]>;
  findByOrderId(orderId: string): Promise<Result[]>;
  save(result: Result): Promise<Result>;
  update(id: string, data: UpdateResultData): Promise<Result>;
}
