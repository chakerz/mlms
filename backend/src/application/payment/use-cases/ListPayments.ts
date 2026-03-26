import { IPaymentRepository, ListPaymentsQuery } from '../../../domain/payment/repositories/IPaymentRepository';
import { PaymentStatus } from '../../../domain/payment/types/PaymentStatus';
import { PaymentDto } from '../dto/PaymentDto';

export interface ListPaymentsRequest {
  page?: number;
  pageSize?: number;
  status?: string;
  patientId?: string;
  invoiceId?: string;
}

export class ListPayments {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(req: ListPaymentsRequest): Promise<{ data: PaymentDto[]; total: number; page: number; pageSize: number }> {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;

    const query: ListPaymentsQuery = {
      page,
      pageSize,
      status: req.status as PaymentStatus | undefined,
      patientId: req.patientId,
      invoiceId: req.invoiceId,
    };

    const { payments, total } = await this.paymentRepo.list(query);
    return { data: payments.map(PaymentDto.from), total, page, pageSize };
  }
}
