import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { OrderStatus } from '../../../domain/order/types/OrderStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { OrderDto } from '../dto/OrderDto';

const CANCELLABLE = [OrderStatus.PENDING, OrderStatus.COLLECTED, OrderStatus.ANALYZED];

export class CancelOrder {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(id: string): Promise<OrderDto> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new DomainNotFoundException('Order', id);

    if (!CANCELLABLE.includes(order.status)) {
      throw new DomainValidationException(
        `Order in status ${order.status} cannot be cancelled`,
      );
    }

    const updated = await this.orderRepo.updateStatus(id, OrderStatus.CANCELLED);
    return OrderDto.from(updated);
  }
}
