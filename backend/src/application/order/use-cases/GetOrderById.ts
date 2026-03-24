import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { OrderDto } from '../dto/OrderDto';

export class GetOrderById {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(id: string): Promise<OrderDto> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new DomainNotFoundException('Order', id);
    return OrderDto.from(order);
  }
}
