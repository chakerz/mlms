import { IInvoiceRepository } from '../../../domain/invoice/repositories/IInvoiceRepository';
import { InvoiceStatus } from '../../../domain/invoice/types/InvoiceStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { InvoiceDto } from '../dto/InvoiceDto';

export class UpdateInvoiceStatus {
  constructor(private readonly invoiceRepo: IInvoiceRepository) {}

  async execute(id: string, status: InvoiceStatus): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepo.findById(id);
    if (!invoice) throw new DomainNotFoundException('Invoice', id);

    const updated = await this.invoiceRepo.updateStatus(id, status);
    return InvoiceDto.from(updated);
  }
}
