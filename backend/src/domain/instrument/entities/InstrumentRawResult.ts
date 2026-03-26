export class InstrumentRawResult {
  constructor(
    public readonly id: string,
    public readonly instrumentId: string,
    public readonly specimenId: string | null,
    public readonly orderId: string | null,
    public readonly internalTestCode: string | null,
    public readonly instrumentTestCode: string,
    public readonly resultValue: string | null,
    public readonly resultText: string | null,
    public readonly unit: string | null,
    public readonly flagCode: string | null,
    public readonly deviceStatus: string | null,
    public readonly resultStatus: string,
    public readonly measuredAt: Date | null,
    public readonly importedAt: Date | null,
    public readonly rawMessageId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
