export class InstrumentTestMapping {
  constructor(
    public readonly id: string,
    public readonly instrumentId: string,
    public readonly internalTestCode: string,
    public readonly instrumentTestCode: string,
    public readonly sampleType: string | null,
    public readonly specimenCode: string | null,
    public readonly unit: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
