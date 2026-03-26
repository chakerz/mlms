import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPaymentRepository, ListPaymentsQuery } from '../../../domain/payment/repositories/IPaymentRepository';
import { Payment } from '../../../domain/payment/entities/Payment';
import { PaymentStatus } from '../../../domain/payment/types/PaymentStatus';
import { PaymentMethod } from '../../../domain/payment/types/PaymentMethod';

type PrismaPaymentRow = {
  id: string;
  referenceNumber: string;
  invoiceId: string | null;
  patientId: string | null;
  patientName: string | null;
  paymentDate: Date;
  totalAmount: number;
  amountPaid: number;
  status: string;
  paymentMethod: string;
  notes: string | null;
  totalAmountInWordsFr: string | null;
  totalAmountInWordsEn: string | null;
  amountPaidInWordsFr: string | null;
  amountPaidInWordsEn: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PaymentPrismaRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Payment | null> {
    const row = await this.prisma.payment.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(payment: Payment): Promise<Payment> {
    const row = await this.prisma.payment.create({
      data: {
        referenceNumber: payment.referenceNumber,
        invoiceId: payment.invoiceId,
        patientId: payment.patientId,
        patientName: payment.patientName,
        paymentDate: payment.paymentDate,
        totalAmount: payment.totalAmount,
        amountPaid: payment.amountPaid,
        status: payment.status as unknown as import('@prisma/client').PaymentStatus,
        paymentMethod: payment.paymentMethod as unknown as import('@prisma/client').PaymentMethod,
        notes: payment.notes,
        totalAmountInWordsFr: payment.totalAmountInWordsFr,
        totalAmountInWordsEn: payment.totalAmountInWordsEn,
        amountPaidInWordsFr: payment.amountPaidInWordsFr,
        amountPaidInWordsEn: payment.amountPaidInWordsEn,
      },
    });
    return this.toDomain(row);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const row = await this.prisma.payment.update({
      where: { id },
      data: { status: status as unknown as import('@prisma/client').PaymentStatus },
    });
    return this.toDomain(row);
  }

  async list(query: ListPaymentsQuery): Promise<{ payments: Payment[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (query.status) where['status'] = query.status as unknown as import('@prisma/client').PaymentStatus;
    if (query.patientId) where['patientId'] = query.patientId;
    if (query.invoiceId) where['invoiceId'] = query.invoiceId;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { payments: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: PrismaPaymentRow): Payment {
    return new Payment(
      row.id,
      row.referenceNumber,
      row.invoiceId,
      row.patientId,
      row.patientName,
      row.paymentDate,
      row.totalAmount,
      row.amountPaid,
      row.status as PaymentStatus,
      row.paymentMethod as PaymentMethod,
      row.notes,
      row.totalAmountInWordsFr,
      row.totalAmountInWordsEn,
      row.amountPaidInWordsFr,
      row.amountPaidInWordsEn,
      row.createdAt,
      row.updatedAt,
    );
  }
}
