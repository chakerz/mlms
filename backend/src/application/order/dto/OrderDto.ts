import { Order } from '../../../domain/order/entities/Order';
import { TestOrderDto } from './TestOrderDto';

export class OrderDto {
  id: string;
  patientId: string;
  status: string;
  priority: string;
  prescriptorName: string | null;
  prescriptorType: string | null;
  createdBy: string | null;
  tests: TestOrderDto[];
  createdAt: string;
  updatedAt: string;

  static from(order: Order): OrderDto {
    const dto = new OrderDto();
    dto.id = order.id;
    dto.patientId = order.patientId;
    dto.status = order.status;
    dto.priority = order.priority;
    dto.prescriptorName = order.prescriptorName;
    dto.prescriptorType = order.prescriptorType;
    dto.createdBy = order.createdBy;
    dto.tests = order.tests.map(TestOrderDto.from);
    dto.createdAt = order.createdAt.toISOString();
    dto.updatedAt = order.updatedAt.toISOString();
    return dto;
  }
}
