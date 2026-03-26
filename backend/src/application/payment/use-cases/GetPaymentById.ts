import { IPaymentRepository } from '../../../domain/payment/repositories/IPaymentRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { PaymentDto } from '../dto/PaymentDto';

export class GetPaymentById {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(id: string): Promise<PaymentDto> {
    const payment = await this.paymentRepo.findById(id);
    if (!payment) throw new DomainNotFoundException('Payment', id);
    return PaymentDto.from(payment);
  }
}
