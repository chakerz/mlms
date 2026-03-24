import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IOrderRepository, ListOrdersQuery } from '../../../domain/order/repositories/IOrderRepository';
import { Order } from '../../../domain/order/entities/Order';
import { TestOrder } from '../../../domain/order/entities/TestOrder';
import { OrderStatus } from '../../../domain/order/types/OrderStatus';
import { OrderPriority } from '../../../domain/order/types/OrderPriority';
import { PrescriptorType } from '../../../domain/order/types/PrescriptorType';
import { TestOrderPriority } from '../../../domain/order/types/TestOrderPriority';

type PrismaOrderRow = {
  id: string;
  patientId: string;
  status: string;
  priority: string;
  prescriptorName: string | null;
  prescriptorType: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  tests: PrismaTestOrderRow[];
};

type PrismaTestOrderRow = {
  id: string;
  orderId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  priority: string;
  notes: string | null;
};

@Injectable()
export class OrderPrismaRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const row = await this.prisma.order.findUnique({
      where: { id },
      include: { tests: true },
    });
    return row ? this.toDomain(row) : null;
  }

  async save(order: Order): Promise<Order> {
    if (order.id) {
      const row = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          patientId: order.patientId,
          status: order.status as unknown as import('@prisma/client').OrderStatus,
          priority: order.priority as unknown as import('@prisma/client').OrderPriority,
          prescriptorName: order.prescriptorName,
          prescriptorType: order.prescriptorType as unknown as import('@prisma/client').PrescriptorType | null,
          createdBy: order.createdBy,
        },
        include: { tests: true },
      });
      return this.toDomain(row);
    }

    const row = await this.prisma.order.create({
      data: {
        patientId: order.patientId,
        status: order.status as unknown as import('@prisma/client').OrderStatus,
        priority: order.priority as unknown as import('@prisma/client').OrderPriority,
        prescriptorName: order.prescriptorName,
        prescriptorType: order.prescriptorType as unknown as import('@prisma/client').PrescriptorType | null,
        createdBy: order.createdBy,
        tests: {
          create: order.tests.map((t) => ({
            testCode: t.testCode,
            testNameFr: t.testNameFr,
            testNameAr: t.testNameAr,
            priority: t.priority as unknown as import('@prisma/client').TestOrderPriority,
            notes: t.notes,
          })),
        },
      },
      include: { tests: true },
    });
    return this.toDomain(row);
  }

  async list(query: ListOrdersQuery): Promise<{ orders: Order[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.patientId) where['patientId'] = query.patientId;
    if (query.status) where['status'] = query.status as unknown as import('@prisma/client').OrderStatus;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: { tests: true },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return { orders: rows.map((r) => this.toDomain(r)), total };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const row = await this.prisma.order.update({
      where: { id },
      data: { status: status as unknown as import('@prisma/client').OrderStatus },
      include: { tests: true },
    });
    return this.toDomain(row);
  }

  private toDomain(row: PrismaOrderRow): Order {
    return new Order(
      row.id,
      row.patientId,
      row.status as OrderStatus,
      row.priority as OrderPriority,
      row.prescriptorName,
      row.prescriptorType ? (row.prescriptorType as PrescriptorType) : null,
      row.createdBy,
      row.tests.map(this.testToDomain),
      row.createdAt,
      row.updatedAt,
    );
  }

  private testToDomain(row: PrismaTestOrderRow): TestOrder {
    return new TestOrder(
      row.id,
      row.orderId,
      row.testCode,
      row.testNameFr,
      row.testNameAr,
      row.priority as TestOrderPriority,
      row.notes,
    );
  }
}
