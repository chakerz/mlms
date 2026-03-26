export class QCSchedule {
  constructor(
    public readonly id: string,
    public readonly barcode: string,
    public readonly qcRuleName: string,
    public readonly scheduledDate: Date,
    public readonly duration: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
