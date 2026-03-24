import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, REAGENT_REPOSITORY } from './persistence.module';
import { IReagentRepository } from '../domain/reagent/repositories/IReagentRepository';
import { AuditService } from '../application/common/services/AuditService';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { CreateReagent } from '../application/reagent/use-cases/CreateReagent';
import { ListReagents } from '../application/reagent/use-cases/ListReagents';
import { ReceiveReagentLot } from '../application/reagent/use-cases/ReceiveReagentLot';
import { ListReagentLots } from '../application/reagent/use-cases/ListReagentLots';
import { ConsumeReagentForTest } from '../application/reagent/use-cases/ConsumeReagentForTest';
import { ReagentController } from '../interfaces/http/controllers/ReagentController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: AuditService,
      useFactory: (prisma: PrismaService) => new AuditService(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateReagent,
      useFactory: (repo: IReagentRepository) => new CreateReagent(repo),
      inject: [REAGENT_REPOSITORY],
    },
    {
      provide: ListReagents,
      useFactory: (repo: IReagentRepository) => new ListReagents(repo),
      inject: [REAGENT_REPOSITORY],
    },
    {
      provide: ReceiveReagentLot,
      useFactory: (repo: IReagentRepository) => new ReceiveReagentLot(repo),
      inject: [REAGENT_REPOSITORY],
    },
    {
      provide: ListReagentLots,
      useFactory: (repo: IReagentRepository) => new ListReagentLots(repo),
      inject: [REAGENT_REPOSITORY],
    },
    {
      provide: ConsumeReagentForTest,
      useFactory: (repo: IReagentRepository, audit: AuditService) => new ConsumeReagentForTest(repo, audit),
      inject: [REAGENT_REPOSITORY, AuditService],
    },
  ],
  controllers: [ReagentController],
})
export class ReagentModule {}
