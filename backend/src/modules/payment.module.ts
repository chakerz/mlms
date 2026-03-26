import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, PAYMENT_REPOSITORY } from './persistence.module';
import { IPaymentRepository } from '../domain/payment/repositories/IPaymentRepository';
import { CreatePayment } from '../application/payment/use-cases/CreatePayment';
import { GetPaymentById } from '../application/payment/use-cases/GetPaymentById';
import { ListPayments } from '../application/payment/use-cases/ListPayments';
import { UpdatePaymentStatus } from '../application/payment/use-cases/UpdatePaymentStatus';
import { PaymentController } from '../interfaces/http/controllers/PaymentController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: CreatePayment,
      useFactory: (repo: IPaymentRepository) => new CreatePayment(repo),
      inject: [PAYMENT_REPOSITORY],
    },
    {
      provide: GetPaymentById,
      useFactory: (repo: IPaymentRepository) => new GetPaymentById(repo),
      inject: [PAYMENT_REPOSITORY],
    },
    {
      provide: ListPayments,
      useFactory: (repo: IPaymentRepository) => new ListPayments(repo),
      inject: [PAYMENT_REPOSITORY],
    },
    {
      provide: UpdatePaymentStatus,
      useFactory: (repo: IPaymentRepository) => new UpdatePaymentStatus(repo),
      inject: [PAYMENT_REPOSITORY],
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
