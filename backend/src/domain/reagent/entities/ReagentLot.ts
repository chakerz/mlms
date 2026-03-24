export class ReagentLot {
  constructor(
    public readonly id: string,
    public readonly reagentId: string,
    public readonly lotNumber: string,
    public readonly expiryDate: Date,
    public readonly initialQuantity: number,
    public readonly currentQuantity: number,
    public readonly isBlocked: boolean,
    public readonly storageLocation: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get isExpired(): boolean {
    return this.expiryDate < new Date();
  }
}
