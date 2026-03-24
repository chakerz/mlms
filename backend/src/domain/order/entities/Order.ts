import { OrderStatus } from '../types/OrderStatus';
import { OrderPriority } from '../types/OrderPriority';
import { PrescriptorType } from '../types/PrescriptorType';
import { TestOrder } from './TestOrder';

export class Order {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly status: OrderStatus,
    public readonly priority: OrderPriority,
    public readonly prescriptorName: string | null,
    public readonly prescriptorType: PrescriptorType | null,
    public readonly createdBy: string | null,
    public readonly tests: TestOrder[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
