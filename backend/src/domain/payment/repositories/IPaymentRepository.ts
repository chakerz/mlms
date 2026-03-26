import { Payment } from '../entities/Payment';
import { PaymentStatus } from '../types/PaymentStatus';

export interface ListPaymentsQuery {
  page: number;
  pageSize: number;
  status?: PaymentStatus;
  patientId?: string;
  invoiceId?: string;
}

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  save(payment: Payment): Promise<Payment>;
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>;
  list(query: ListPaymentsQuery): Promise<{ payments: Payment[]; total: number }>;
}
