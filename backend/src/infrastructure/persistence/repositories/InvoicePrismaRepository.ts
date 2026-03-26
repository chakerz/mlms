import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInvoiceRepository, ListInvoicesQuery } from '../../../domain/invoice/repositories/IInvoiceRepository';
import { Invoice } from '../../../domain/invoice/entities/Invoice';
import { InvoiceLine } from '../../../domain/invoice/entities/InvoiceLine';
import { InvoiceStatus } from '../../../domain/invoice/types/InvoiceStatus';

type PrismaInvoiceLineRow = {
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
  createdAt: Date;
  updatedAt: Date;
};

type PrismaInvoiceRow = {
  id: string;
  invoiceNumber: string;
  orderId: string | null;
  patientId: string | null;
  practitionerId: string | null;
  customerName: string;
  customerAddress: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  invoiceDate: Date;
  dueDate: Date;
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
  lines: PrismaInvoiceLineRow[];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class InvoicePrismaRepository implements IInvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Invoice | null> {
    const row = await this.prisma.invoice.findUnique({
      where: { id },
      include: { lines: true },
    });
    return row ? this.toDomain(row) : null;
  }

  async save(invoice: Invoice): Promise<Invoice> {
    const row = await this.prisma.invoice.create({
      data: {
        invoiceNumber: invoice.invoiceNumber,
        orderId: invoice.orderId,
        patientId: invoice.patientId,
        practitionerId: invoice.practitionerId,
        customerName: invoice.customerName,
        customerAddress: invoice.customerAddress,
        customerEmail: invoice.customerEmail,
        customerPhone: invoice.customerPhone,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paymentTerms: invoice.paymentTerms,
        status: invoice.status as unknown as import('@prisma/client').InvoiceStatus,
        subtotal: invoice.subtotal,
        totalDiscount: invoice.totalDiscount,
        totalTax: invoice.totalTax,
        total: invoice.total,
        amountPaid: invoice.amountPaid,
        balanceDue: invoice.balanceDue,
        billingCodes: invoice.billingCodes,
        comments: invoice.comments,
        totalInWordsFr: invoice.totalInWordsFr,
        totalInWordsEn: invoice.totalInWordsEn,
        lines: {
          create: invoice.lines.map((l) => ({
            testOrderId: l.testOrderId,
            itemDescription: l.itemDescription,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            totalPrice: l.totalPrice,
            taxRate: l.taxRate,
            taxAmount: l.taxAmount,
            discountPercentage: l.discountPercentage,
            discountAmount: l.discountAmount,
            subTotal: l.subTotal,
            lineTotal: l.lineTotal,
            billingCode: l.billingCode,
          })),
        },
      },
      include: { lines: true },
    });
    return this.toDomain(row);
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const row = await this.prisma.invoice.update({
      where: { id },
      data: { status: status as unknown as import('@prisma/client').InvoiceStatus },
      include: { lines: true },
    });
    return this.toDomain(row);
  }

  async list(query: ListInvoicesQuery): Promise<{ invoices: Invoice[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (query.status) where['status'] = query.status as unknown as import('@prisma/client').InvoiceStatus;
    if (query.patientId) where['patientId'] = query.patientId;
    if (query.dateFrom || query.dateTo) {
      where['invoiceDate'] = {
        ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
        ...(query.dateTo && { lte: new Date(query.dateTo) }),
      };
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where,
        include: { lines: true },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return { invoices: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: PrismaInvoiceRow): Invoice {
    return new Invoice(
      row.id,
      row.invoiceNumber,
      row.orderId,
      row.patientId,
      row.practitionerId,
      row.customerName,
      row.customerAddress,
      row.customerEmail,
      row.customerPhone,
      row.invoiceDate,
      row.dueDate,
      row.paymentTerms,
      row.status as InvoiceStatus,
      row.subtotal,
      row.totalDiscount,
      row.totalTax,
      row.total,
      row.amountPaid,
      row.balanceDue,
      row.billingCodes,
      row.comments,
      row.totalInWordsFr,
      row.totalInWordsEn,
      row.lines.map(this.lineToDoomain),
      row.createdAt,
      row.updatedAt,
    );
  }

  private lineToDoomain(row: PrismaInvoiceLineRow): InvoiceLine {
    return new InvoiceLine(
      row.id,
      row.invoiceId,
      row.testOrderId,
      row.itemDescription,
      row.quantity,
      row.unitPrice,
      row.totalPrice,
      row.taxRate,
      row.taxAmount,
      row.discountPercentage,
      row.discountAmount,
      row.subTotal,
      row.lineTotal,
      row.billingCode,
      row.createdAt,
      row.updatedAt,
    );
  }
}
