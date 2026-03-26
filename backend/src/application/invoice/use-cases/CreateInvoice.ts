import { IInvoiceRepository } from '../../../domain/invoice/repositories/IInvoiceRepository';
import { Invoice } from '../../../domain/invoice/entities/Invoice';
import { InvoiceLine } from '../../../domain/invoice/entities/InvoiceLine';
import { InvoiceStatus } from '../../../domain/invoice/types/InvoiceStatus';
import { CreateInvoiceDto } from '../dto/CreateInvoiceDto';
import { InvoiceDto } from '../dto/InvoiceDto';

function generateInvoiceNumber(): string {
  return 'INV' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export class CreateInvoice {
  constructor(private readonly invoiceRepo: IInvoiceRepository) {}

  async execute(dto: CreateInvoiceDto): Promise<InvoiceDto> {
    const now = new Date();
    const invoiceDate = dto.invoiceDate ? new Date(dto.invoiceDate) : now;
    const dueDate = dto.dueDate ? new Date(dto.dueDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const lines = (dto.lines ?? []).map((l) => {
      const quantity = l.quantity ?? 1;
      const unitPrice = l.unitPrice ?? 0;
      const taxRate = l.taxRate ?? 0;
      const discountPercentage = l.discountPercentage ?? 0;

      const totalPrice = quantity * unitPrice;
      const discountAmount = totalPrice * (discountPercentage / 100);
      const subTotal = totalPrice - discountAmount;
      const taxAmount = subTotal * (taxRate / 100);
      const lineTotal = subTotal + taxAmount;

      return new InvoiceLine(
        '',
        '',
        l.testOrderId ?? null,
        l.itemDescription,
        quantity,
        unitPrice,
        totalPrice,
        taxRate,
        taxAmount,
        discountPercentage,
        discountAmount,
        subTotal,
        lineTotal,
        l.billingCode ?? null,
        now,
        now,
      );
    });

    const subtotal = lines.reduce((sum, l) => sum + l.subTotal, 0);
    const totalDiscount = lines.reduce((sum, l) => sum + l.discountAmount, 0);
    const totalTax = lines.reduce((sum, l) => sum + l.taxAmount, 0);
    const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);

    const invoice = new Invoice(
      '',
      generateInvoiceNumber(),
      dto.orderId ?? null,
      dto.patientId ?? null,
      dto.practitionerId ?? null,
      dto.customerName,
      dto.customerAddress ?? null,
      dto.customerEmail ?? null,
      dto.customerPhone ?? null,
      invoiceDate,
      dueDate,
      dto.paymentTerms ?? null,
      InvoiceStatus.DRAFT,
      subtotal,
      totalDiscount,
      totalTax,
      total,
      0,
      total,
      dto.billingCodes ?? null,
      dto.comments ?? null,
      null,
      null,
      lines,
      now,
      now,
    );

    const saved = await this.invoiceRepo.save(invoice);
    return InvoiceDto.from(saved);
  }
}
