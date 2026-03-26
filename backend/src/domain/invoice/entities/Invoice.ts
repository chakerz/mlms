import { InvoiceStatus } from '../types/InvoiceStatus';
import { InvoiceLine } from './InvoiceLine';

export class Invoice {
  constructor(
    public readonly id: string,
    public readonly invoiceNumber: string,
    public readonly orderId: string | null,
    public readonly patientId: string | null,
    public readonly practitionerId: string | null,
    public readonly customerName: string,
    public readonly customerAddress: string | null,
    public readonly customerEmail: string | null,
    public readonly customerPhone: string | null,
    public readonly invoiceDate: Date,
    public readonly dueDate: Date,
    public readonly paymentTerms: string | null,
    public readonly status: InvoiceStatus,
    public readonly subtotal: number,
    public readonly totalDiscount: number,
    public readonly totalTax: number,
    public readonly total: number,
    public readonly amountPaid: number,
    public readonly balanceDue: number,
    public readonly billingCodes: string | null,
    public readonly comments: string | null,
    public readonly totalInWordsFr: string | null,
    public readonly totalInWordsEn: string | null,
    public readonly lines: InvoiceLine[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
