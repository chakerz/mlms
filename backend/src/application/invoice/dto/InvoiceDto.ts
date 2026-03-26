import { Invoice } from '../../../domain/invoice/entities/Invoice';
import { InvoiceLineDto } from './InvoiceLineDto';

export class InvoiceDto {
  id: string;
  invoiceNumber: string;
  orderId: string | null;
  patientId: string | null;
  practitionerId: string | null;
  customerName: string;
  customerAddress: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string | null;
  status: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  billingCodes: string | null;
  comments: string | null;
  totalInWordsFr: string | null;
  totalInWordsEn: string | null;
  lines: InvoiceLineDto[];
  createdAt: string;
  updatedAt: string;

  static from(invoice: Invoice): InvoiceDto {
    const dto = new InvoiceDto();
    dto.id = invoice.id;
    dto.invoiceNumber = invoice.invoiceNumber;
    dto.orderId = invoice.orderId;
    dto.patientId = invoice.patientId;
    dto.practitionerId = invoice.practitionerId;
    dto.customerName = invoice.customerName;
    dto.customerAddress = invoice.customerAddress;
    dto.customerEmail = invoice.customerEmail;
    dto.customerPhone = invoice.customerPhone;
    dto.invoiceDate = invoice.invoiceDate.toISOString();
    dto.dueDate = invoice.dueDate.toISOString();
    dto.paymentTerms = invoice.paymentTerms;
    dto.status = invoice.status;
    dto.subtotal = invoice.subtotal;
    dto.totalDiscount = invoice.totalDiscount;
    dto.totalTax = invoice.totalTax;
    dto.total = invoice.total;
    dto.amountPaid = invoice.amountPaid;
    dto.balanceDue = invoice.balanceDue;
    dto.billingCodes = invoice.billingCodes;
    dto.comments = invoice.comments;
    dto.totalInWordsFr = invoice.totalInWordsFr;
    dto.totalInWordsEn = invoice.totalInWordsEn;
    dto.lines = invoice.lines.map(InvoiceLineDto.from);
    dto.createdAt = invoice.createdAt.toISOString();
    dto.updatedAt = invoice.updatedAt.toISOString();
    return dto;
  }
}
