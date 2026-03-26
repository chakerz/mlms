import { IInvoiceRepository, ListInvoicesQuery } from '../../../domain/invoice/repositories/IInvoiceRepository';
import { InvoiceStatus } from '../../../domain/invoice/types/InvoiceStatus';
import { InvoiceDto } from '../dto/InvoiceDto';

export interface ListInvoicesRequest {
  page?: number;
  pageSize?: number;
  status?: string;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class ListInvoices {
  constructor(private readonly invoiceRepo: IInvoiceRepository) {}

  async execute(req: ListInvoicesRequest): Promise<{ data: InvoiceDto[]; total: number; page: number; pageSize: number }> {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;

    const query: ListInvoicesQuery = {
      page,
      pageSize,
      status: req.status as InvoiceStatus | undefined,
      patientId: req.patientId,
      dateFrom: req.dateFrom,
      dateTo: req.dateTo,
    };

    const { invoices, total } = await this.invoiceRepo.list(query);
    return { data: invoices.map(InvoiceDto.from), total, page, pageSize };
  }
}
