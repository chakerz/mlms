import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, ORDER_REPOSITORY, PATIENT_REPOSITORY, SPECIMEN_REPOSITORY, RESULT_REPOSITORY } from './persistence.module';
import { IOrderRepository } from '../domain/order/repositories/IOrderRepository';
import { IPatientRepository } from '../domain/patient/repositories/IPatientRepository';
import { ISpecimenRepository } from '../domain/specimen/repositories/ISpecimenRepository';
import { IResultRepository } from '../domain/result/repositories/IResultRepository';
import { ListResultsByOrder } from '../application/result/use-cases/ListResultsByOrder';
import { CreateOrder } from '../application/order/use-cases/CreateOrder';
import { GetOrderById } from '../application/order/use-cases/GetOrderById';
import { ListOrders } from '../application/order/use-cases/ListOrders';
import { UpdateOrderStatus } from '../application/order/use-cases/UpdateOrderStatus';
import { CancelOrder } from '../application/order/use-cases/CancelOrder';
import { ListSpecimensByOrder } from '../application/specimen/use-cases/ListSpecimensByOrder';
import { OrderController } from '../interfaces/http/controllers/OrderController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: CreateOrder,
      useFactory: (orderRepo: IOrderRepository, patientRepo: IPatientRepository) =>
        new CreateOrder(orderRepo, patientRepo),
      inject: [ORDER_REPOSITORY, PATIENT_REPOSITORY],
    },
    {
      provide: GetOrderById,
      useFactory: (repo: IOrderRepository) => new GetOrderById(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: ListOrders,
      useFactory: (repo: IOrderRepository) => new ListOrders(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: UpdateOrderStatus,
      useFactory: (repo: IOrderRepository) => new UpdateOrderStatus(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: CancelOrder,
      useFactory: (repo: IOrderRepository) => new CancelOrder(repo),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: ListSpecimensByOrder,
      useFactory: (repo: ISpecimenRepository) => new ListSpecimensByOrder(repo),
      inject: [SPECIMEN_REPOSITORY],
    },
    {
      provide: ListResultsByOrder,
      useFactory: (repo: IResultRepository) => new ListResultsByOrder(repo),
      inject: [RESULT_REPOSITORY],
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
