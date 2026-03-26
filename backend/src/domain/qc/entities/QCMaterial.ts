export class QCMaterial {
  constructor(
    public readonly id: string,
    public readonly barcode: string,
    public readonly name: string,
    public readonly lotNumber: string,
    public readonly manufacturer: string,
    public readonly expirationDate: Date,
    public readonly expectedValue: number,
    public readonly standardDeviation: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
