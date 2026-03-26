import { IInvoiceRepository } from '../../../domain/invoice/repositories/IInvoiceRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { InvoiceDto } from '../dto/InvoiceDto';

export class GetInvoiceById {
  constructor(private readonly invoiceRepo: IInvoiceRepository) {}

  async execute(id: string): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepo.findById(id);
    if (!invoice) throw new DomainNotFoundException('Invoice', id);
    return InvoiceDto.from(invoice);
  }
}
