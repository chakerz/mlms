import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, PATIENT_REPOSITORY } from './persistence.module';
import { RegisterPatient } from '../application/patient/use-cases/RegisterPatient';
import { GetPatientById } from '../application/patient/use-cases/GetPatientById';
import { ListPatients } from '../application/patient/use-cases/ListPatients';
import { UpdatePatient } from '../application/patient/use-cases/UpdatePatient';
import { PatientController } from '../interfaces/http/controllers/PatientController';
import { IPatientRepository } from '../domain/patient/repositories/IPatientRepository';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: RegisterPatient,
      useFactory: (repo: IPatientRepository) => new RegisterPatient(repo),
      inject: [PATIENT_REPOSITORY],
    },
    {
      provide: GetPatientById,
      useFactory: (repo: IPatientRepository) => new GetPatientById(repo),
      inject: [PATIENT_REPOSITORY],
    },
    {
      provide: ListPatients,
      useFactory: (repo: IPatientRepository) => new ListPatients(repo),
      inject: [PATIENT_REPOSITORY],
    },
    {
      provide: UpdatePatient,
      useFactory: (repo: IPatientRepository) => new UpdatePatient(repo),
      inject: [PATIENT_REPOSITORY],
    },
  ],
  controllers: [PatientController],
})
export class PatientModule {}
