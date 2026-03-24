import { TestOrderPriority } from '../types/TestOrderPriority';

export class TestOrder {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly testCode: string,
    public readonly testNameFr: string,
    public readonly testNameAr: string,
    public readonly priority: TestOrderPriority,
    public readonly notes: string | null,
  ) {}
}
