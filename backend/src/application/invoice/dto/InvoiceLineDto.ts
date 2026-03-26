import { InvoiceLine } from '../../../domain/invoice/entities/InvoiceLine';

export class InvoiceLineDto {
  id: string;
  invoiceId: string;
  testOrderId: string | null;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  subTotal: number;
  lineTotal: number;
  billingCode: string | null;
  createdAt: string;
  updatedAt: string;

  static from(line: InvoiceLine): InvoiceLineDto {
    const dto = new InvoiceLineDto();
    dto.id = line.id;
    dto.invoiceId = line.invoiceId;
    dto.testOrderId = line.testOrderId;
    dto.itemDescription = line.itemDescription;
    dto.quantity = line.quantity;
    dto.unitPrice = line.unitPrice;
    dto.totalPrice = line.totalPrice;
    dto.taxRate = line.taxRate;
    dto.taxAmount = line.taxAmount;
    dto.discountPercentage = line.discountPercentage;
    dto.discountAmount = line.discountAmount;
    dto.subTotal = line.subTotal;
    dto.lineTotal = line.lineTotal;
    dto.billingCode = line.billingCode;
    dto.createdAt = line.createdAt.toISOString();
    dto.updatedAt = line.updatedAt.toISOString();
    return dto;
  }
}
