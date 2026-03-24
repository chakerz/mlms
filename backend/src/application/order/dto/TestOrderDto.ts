import { TestOrder } from '../../../domain/order/entities/TestOrder';

export class TestOrderDto {
  id: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  priority: string;
  notes: string | null;

  static from(t: TestOrder): TestOrderDto {
    const dto = new TestOrderDto();
    dto.id = t.id;
    dto.testCode = t.testCode;
    dto.testNameFr = t.testNameFr;
    dto.testNameAr = t.testNameAr;
    dto.priority = t.priority;
    dto.notes = t.notes;
    return dto;
  }
}
