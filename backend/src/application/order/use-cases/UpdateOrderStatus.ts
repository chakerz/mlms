import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { OrderStatus } from '../../../domain/order/types/OrderStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { OrderDto } from '../dto/OrderDto';

const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.PENDING]:    [OrderStatus.COLLECTED, OrderStatus.CANCELLED],
  [OrderStatus.COLLECTED]:  [OrderStatus.ANALYZED,  OrderStatus.CANCELLED],
  [OrderStatus.ANALYZED]:   [OrderStatus.VALIDATED, OrderStatus.CANCELLED],
  [OrderStatus.VALIDATED]:  [OrderStatus.PUBLISHED],
};

export class UpdateOrderStatus {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(id: string, newStatus: OrderStatus): Promise<OrderDto> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new DomainNotFoundException('Order', id);

    const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new DomainValidationException(
        `Transition ${order.status} → ${newStatus} not allowed`,
      );
    }

    const updated = await this.orderRepo.updateStatus(id, newStatus);
    return OrderDto.from(updated);
  }
}
