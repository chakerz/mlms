import { IPaymentRepository } from '../../../domain/payment/repositories/IPaymentRepository';
import { PaymentStatus } from '../../../domain/payment/types/PaymentStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { PaymentDto } from '../dto/PaymentDto';

export class UpdatePaymentStatus {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  async execute(id: string, status: PaymentStatus): Promise<PaymentDto> {
    const payment = await this.paymentRepo.findById(id);
    if (!payment) throw new DomainNotFoundException('Payment', id);

    const updated = await this.paymentRepo.updateStatus(id, status);
    return PaymentDto.from(updated);
  }
}
