import { IPaymentRepository } from '../../../domain/payment/repositories/IPaymentRepository';
import { Payment } from '../../../domain/payment/entities/Payment';
import { PaymentStatus } from '../../../domain/payment/types/PaymentStatus';
import { CreatePaymentDto } from '../dto/CreatePaymentDto';
import { PaymentDto } from '../dto/PaymentDto';

function generateReferenceNumber(): string {
  return 'REF' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export class CreatePayment {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(dto: CreatePaymentDto): Promise<PaymentDto> {
    const now = new Date();
    const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : now;

    const payment = new Payment(
      '',
      generateReferenceNumber(),
      dto.invoiceId ?? null,
      dto.patientId ?? null,
      dto.patientName ?? null,
      paymentDate,
      dto.totalAmount,
      dto.amountPaid,
      PaymentStatus.PENDING,
      dto.paymentMethod,
      dto.notes ?? null,
      dto.totalAmountInWordsFr ?? null,
      dto.totalAmountInWordsEn ?? null,
      dto.amountPaidInWordsFr ?? null,
      dto.amountPaidInWordsEn ?? null,
      now,
      now,
    );

    const saved = await this.paymentRepo.save(payment);
    return PaymentDto.from(saved);
  }
}
