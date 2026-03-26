export class InvoiceLine {
  constructor(
    public readonly id: string,
    public readonly invoiceId: string,
    public readonly testOrderId: string | null,
    public readonly itemDescription: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
    public readonly taxRate: number,
    public readonly taxAmount: number,
    public readonly discountPercentage: number,
    public readonly discountAmount: number,
    public readonly subTotal: number,
    public readonly lineTotal: number,
    public readonly billingCode: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
