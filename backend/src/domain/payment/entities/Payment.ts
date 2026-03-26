import { PaymentStatus } from '../types/PaymentStatus';
import { PaymentMethod } from '../types/PaymentMethod';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly referenceNumber: string,
    public readonly invoiceId: string | null,
    public readonly patientId: string | null,
    public readonly patientName: string | null,
    public readonly paymentDate: Date,
    public readonly totalAmount: number,
    public readonly amountPaid: number,
    public readonly status: PaymentStatus,
    public readonly paymentMethod: PaymentMethod,
    public readonly notes: string | null,
    public readonly totalAmountInWordsFr: string | null,
    public readonly totalAmountInWordsEn: string | null,
    public readonly amountPaidInWordsFr: string | null,
    public readonly amountPaidInWordsEn: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
