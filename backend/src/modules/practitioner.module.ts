import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, PRACTITIONER_REPOSITORY } from './persistence.module';
import { IPractitionerRepository } from '../domain/practitioner/repositories/IPractitionerRepository';
import { CreatePractitioner } from '../application/practitioner/use-cases/CreatePractitioner';
import { GetPractitionerById } from '../application/practitioner/use-cases/GetPractitionerById';
import { ListPractitioners } from '../application/practitioner/use-cases/ListPractitioners';
import { UpdatePractitioner } from '../application/practitioner/use-cases/UpdatePractitioner';
import { PractitionerController } from '../interfaces/http/controllers/PractitionerController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: CreatePractitioner,
      useFactory: (repo: IPractitionerRepository) => new CreatePractitioner(repo),
      inject: [PRACTITIONER_REPOSITORY],
    },
    {
      provide: GetPractitionerById,
      useFactory: (repo: IPractitionerRepository) => new GetPractitionerById(repo),
      inject: [PRACTITIONER_REPOSITORY],
    },
    {
      provide: ListPractitioners,
      useFactory: (repo: IPractitionerRepository) => new ListPractitioners(repo),
      inject: [PRACTITIONER_REPOSITORY],
    },
    {
      provide: UpdatePractitioner,
      useFactory: (repo: IPractitionerRepository) => new UpdatePractitioner(repo),
      inject: [PRACTITIONER_REPOSITORY],
    },
  ],
  controllers: [PractitionerController],
})
export class PractitionerModule {}
