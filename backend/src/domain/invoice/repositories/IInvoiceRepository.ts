import { Invoice } from '../entities/Invoice';
import { InvoiceStatus } from '../types/InvoiceStatus';

export interface ListInvoicesQuery {
  page: number;
  pageSize: number;
  status?: InvoiceStatus;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IInvoiceRepository {
  findById(id: string): Promise<Invoice | null>;
  save(invoice: Invoice): Promise<Invoice>;
  updateStatus(id: string, status: InvoiceStatus): Promise<Invoice>;
  list(query: ListInvoicesQuery): Promise<{ invoices: Invoice[]; total: number }>;
}
