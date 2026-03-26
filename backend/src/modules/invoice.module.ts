import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, INVOICE_REPOSITORY } from './persistence.module';
import { IInvoiceRepository } from '../domain/invoice/repositories/IInvoiceRepository';
import { CreateInvoice } from '../application/invoice/use-cases/CreateInvoice';
import { GetInvoiceById } from '../application/invoice/use-cases/GetInvoiceById';
import { ListInvoices } from '../application/invoice/use-cases/ListInvoices';
import { UpdateInvoiceStatus } from '../application/invoice/use-cases/UpdateInvoiceStatus';
import { InvoiceController } from '../interfaces/http/controllers/InvoiceController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: CreateInvoice,
      useFactory: (repo: IInvoiceRepository) => new CreateInvoice(repo),
      inject: [INVOICE_REPOSITORY],
    },
    {
      provide: GetInvoiceById,
      useFactory: (repo: IInvoiceRepository) => new GetInvoiceById(repo),
      inject: [INVOICE_REPOSITORY],
    },
    {
      provide: ListInvoices,
      useFactory: (repo: IInvoiceRepository) => new ListInvoices(repo),
      inject: [INVOICE_REPOSITORY],
    },
    {
      provide: UpdateInvoiceStatus,
      useFactory: (repo: IInvoiceRepository) => new UpdateInvoiceStatus(repo),
      inject: [INVOICE_REPOSITORY],
    },
  ],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
