export class InstrumentOrderOutbox {
  constructor(
    public readonly id: string,
    public readonly instrumentId: string,
    public readonly specimenId: string | null,
    public readonly orderId: string | null,
    public readonly messageType: string,
    public readonly payloadJson: unknown,
    public readonly rawPayload: string | null,
    public readonly status: string,
    public readonly retryCount: number,
    public readonly sentAt: Date | null,
    public readonly ackReceivedAt: Date | null,
    public readonly errorMessage: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
