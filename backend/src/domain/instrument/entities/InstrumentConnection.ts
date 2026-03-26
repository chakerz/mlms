export class InstrumentConnection {
  constructor(
    public readonly id: string,
    public readonly instrumentId: string,
    public readonly host: string | null,
    public readonly port: number | null,
    public readonly serialPort: string | null,
    public readonly baudRate: number | null,
    public readonly parity: string | null,
    public readonly dataBits: number | null,
    public readonly stopBits: number | null,
    public readonly fileImportPath: string | null,
    public readonly fileExportPath: string | null,
    public readonly ackEnabled: boolean,
    public readonly encoding: string | null,
    public readonly timeoutMs: number | null,
    public readonly retryLimit: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
