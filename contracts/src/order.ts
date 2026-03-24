import type { OrderPriority, OrderStatus, PaginationDto } from './common';

// ─── Sub-types ────────────────────────────────────────────────────────────────

export type TestOrderPriority = 'ROUTINE' | 'URGENT';

export interface TestOrderDto {
  id: string;
  orderId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  priority: TestOrderPriority;
  notes: string | null;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateTestOrderItem {
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  priority?: TestOrderPriority;
  notes?: string | null;
}

export interface CreateOrderDto {
  patientId: string;
  priority: OrderPriority;
  tests: CreateTestOrderItem[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface ListOrdersQueryDto extends PaginationDto {
  patientId?: string;
  status?: OrderStatus;
  priority?: OrderPriority;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface OrderDto {
  id: string;
  patientId: string;
  status: OrderStatus;
  priority: OrderPriority;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  tests: TestOrderDto[];
}
