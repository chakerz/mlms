import { Payment } from '../../../domain/payment/entities/Payment';

export class PaymentDto {
  id: string;
  referenceNumber: string;
  invoiceId: string | null;
  patientId: string | null;
  patientName: string | null;
  paymentDate: string;
  totalAmount: number;
  amountPaid: number;
  status: string;
  paymentMethod: string;
  notes: string | null;
  totalAmountInWordsFr: string | null;
  totalAmountInWordsEn: string | null;
  amountPaidInWordsFr: string | null;
  amountPaidInWordsEn: string | null;
  createdAt: string;
  updatedAt: string;

  static from(payment: Payment): PaymentDto {
    const dto = new PaymentDto();
    dto.id = payment.id;
    dto.referenceNumber = payment.referenceNumber;
    dto.invoiceId = payment.invoiceId;
    dto.patientId = payment.patientId;
    dto.patientName = payment.patientName;
    dto.paymentDate = payment.paymentDate.toISOString();
    dto.totalAmount = payment.totalAmount;
    dto.amountPaid = payment.amountPaid;
    dto.status = payment.status;
    dto.paymentMethod = payment.paymentMethod;
    dto.notes = payment.notes;
    dto.totalAmountInWordsFr = payment.totalAmountInWordsFr;
    dto.totalAmountInWordsEn = payment.totalAmountInWordsEn;
    dto.amountPaidInWordsFr = payment.amountPaidInWordsFr;
    dto.amountPaidInWordsEn = payment.amountPaidInWordsEn;
    dto.createdAt = payment.createdAt.toISOString();
    dto.updatedAt = payment.updatedAt.toISOString();
    return dto;
  }
}
