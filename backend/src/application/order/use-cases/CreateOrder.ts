import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { IPatientRepository } from '../../../domain/patient/repositories/IPatientRepository';
import { Order } from '../../../domain/order/entities/Order';
import { TestOrder } from '../../../domain/order/entities/TestOrder';
import { OrderStatus } from '../../../domain/order/types/OrderStatus';
import { TestOrderPriority } from '../../../domain/order/types/TestOrderPriority';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { CreateOrderDto } from '../dto/CreateOrderDto';
import { OrderDto } from '../dto/OrderDto';

export class CreateOrder {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly patientRepo: IPatientRepository,
  ) {}

  async execute(dto: CreateOrderDto, createdBy: string | null): Promise<OrderDto> {
    const patient = await this.patientRepo.findById(dto.patientId);
    if (!patient) throw new DomainNotFoundException('Patient', dto.patientId);

    const tests = dto.tests.map(
      (t) =>
        new TestOrder(
          '',
          '',
          t.testCode,
          t.testNameFr,
          t.testNameAr,
          t.priority ?? TestOrderPriority.ROUTINE,
          t.notes ?? null,
        ),
    );

    const order = new Order(
      '',
      dto.patientId,
      OrderStatus.PENDING,
      dto.priority,
      dto.prescriptorName ?? null,
      dto.prescriptorType ?? null,
      createdBy,
      tests,
      new Date(),
      new Date(),
    );

    const saved = await this.orderRepo.save(order);
    return OrderDto.from(saved);
  }
}
