import { ResultFlag } from '../types/ResultFlag';

export class Result {
  constructor(
    public readonly id: string,
    public readonly specimenId: string,
    public readonly testCode: string,
    public readonly testNameFr: string,
    public readonly testNameAr: string,
    public readonly value: string,
    public readonly unit: string | null,
    public readonly referenceLow: number | null,
    public readonly referenceHigh: number | null,
    public readonly flag: ResultFlag,
    public readonly measuredAt: Date,
    public readonly measuredBy: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
