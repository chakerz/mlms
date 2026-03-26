export class InstrumentMessageAudit {
  constructor(
    public readonly id: string,
    public readonly instrumentId: string,
    public readonly direction: string,
    public readonly messageType: string | null,
    public readonly transportType: string | null,
    public readonly status: string,
    public readonly referenceId: string | null,
    public readonly detailsJson: unknown | null,
    public readonly createdAt: Date,
  ) {}
}
