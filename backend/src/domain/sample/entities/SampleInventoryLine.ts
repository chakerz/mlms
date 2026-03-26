export class SampleInventoryLine {
  constructor(
    public readonly id: string,
    public readonly barcode: string,
    public readonly inventoryCode: string,
    public readonly sampleId: string | null,
    public readonly receptionDate: Date,
    public readonly receivedBy: string | null,
    public readonly currentLocation: string | null,
    public readonly currentStatus: string,
    public readonly quantity: number,
    public readonly unit: string | null,
    public readonly collectionDate: Date | null,
    public readonly collectionSite: string | null,
    public readonly collectedBy: string | null,
    public readonly qcPassed: boolean,
    public readonly qcNotes: string | null,
    public readonly conservationMethod: string | null,
    public readonly expirationDate: Date | null,
    public readonly history: unknown,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
