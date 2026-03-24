import { Order } from '../entities/Order';
import { OrderStatus } from '../types/OrderStatus';

export interface ListOrdersQuery {
  page: number;
  pageSize: number;
  patientId?: string;
  status?: OrderStatus;
}

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<Order>;
  list(query: ListOrdersQuery): Promise<{ orders: Order[]; total: number }>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}
