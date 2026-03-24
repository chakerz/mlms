import { IOrderRepository, ListOrdersQuery } from '../../../domain/order/repositories/IOrderRepository';
import { OrderStatus } from '../../../domain/order/types/OrderStatus';
import { OrderDto } from '../dto/OrderDto';

export interface ListOrdersRequest {
  page?: number;
  pageSize?: number;
  patientId?: string;
  status?: string;
}

export class ListOrders {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async execute(req: ListOrdersRequest): Promise<{ data: OrderDto[]; total: number; page: number; pageSize: number }> {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;

    const query: ListOrdersQuery = {
      page,
      pageSize,
      patientId: req.patientId,
      status: req.status as OrderStatus | undefined,
    };

    const { orders, total } = await this.orderRepo.list(query);
    return { data: orders.map(OrderDto.from), total, page, pageSize };
  }
}
