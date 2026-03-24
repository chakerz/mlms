import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, NON_CONFORMITE_REPOSITORY } from './persistence.module';
import { INonConformiteRepository } from '../domain/non-conformite/repositories/INonConformiteRepository';
import { CreateNonConformite } from '../application/non-conformite/use-cases/CreateNonConformite';
import { GetNonConformite } from '../application/non-conformite/use-cases/GetNonConformite';
import { ListNonConformites } from '../application/non-conformite/use-cases/ListNonConformites';
import { ListNonConformitesBySpecimen } from '../application/non-conformite/use-cases/ListNonConformitesBySpecimen';
import { NonConformiteController } from '../interfaces/http/controllers/NonConformiteController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: CreateNonConformite,
      useFactory: (repo: INonConformiteRepository) => new CreateNonConformite(repo),
      inject: [NON_CONFORMITE_REPOSITORY],
    },
    {
      provide: GetNonConformite,
      useFactory: (repo: INonConformiteRepository) => new GetNonConformite(repo),
      inject: [NON_CONFORMITE_REPOSITORY],
    },
    {
      provide: ListNonConformites,
      useFactory: (repo: INonConformiteRepository) => new ListNonConformites(repo),
      inject: [NON_CONFORMITE_REPOSITORY],
    },
    {
      provide: ListNonConformitesBySpecimen,
      useFactory: (repo: INonConformiteRepository) => new ListNonConformitesBySpecimen(repo),
      inject: [NON_CONFORMITE_REPOSITORY],
    },
  ],
  controllers: [NonConformiteController],
})
export class NonConformiteModule {}
