export class InstrumentResultInbox {
  constructor(
    public readonly id: string,
    public readonly instrumentId: string,
    public readonly messageType: string,
    public readonly rawPayload: string,
    public readonly parsedPayloadJson: unknown | null,
    public readonly sampleId: string | null,
    public readonly barcode: string | null,
    public readonly matchingStatus: string,
    public readonly importStatus: string,
    public readonly receivedAt: Date,
    public readonly processedAt: Date | null,
    public readonly errorMessage: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
