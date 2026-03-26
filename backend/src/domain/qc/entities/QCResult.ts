export class QCResult {
  constructor(
    public readonly id: string,
    public readonly qcScheduleId: string | null,
    public readonly testId: string | null,
    public readonly testName: string,
    public readonly controlMaterialId: string | null,
    public readonly resultValue: string | null,
    public readonly performedDate: Date,
    public readonly performedBy: string | null,
    public readonly status: string,
    public readonly acceptableLimitLow: number,
    public readonly acceptableLimitHigh: number,
    public readonly warningLimitLow: number,
    public readonly warningLimitHigh: number,
    public readonly qualitativeObservation: string | null,
    public readonly alert: string,
    public readonly comments: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
