import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, TEST_DEFINITION_REPOSITORY } from './persistence.module';
import { ITestDefinitionRepository } from '../domain/test-definition/repositories/ITestDefinitionRepository';
import { CreateTestDefinition } from '../application/test-definition/use-cases/CreateTestDefinition';
import { UpdateTestDefinition } from '../application/test-definition/use-cases/UpdateTestDefinition';
import { ListTestDefinitions } from '../application/test-definition/use-cases/ListTestDefinitions';
import { GetTestDefinition } from '../application/test-definition/use-cases/GetTestDefinition';
import { TestDefinitionController } from '../interfaces/http/controllers/TestDefinitionController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: CreateTestDefinition,
      useFactory: (repo: ITestDefinitionRepository) => new CreateTestDefinition(repo),
      inject: [TEST_DEFINITION_REPOSITORY],
    },
    {
      provide: UpdateTestDefinition,
      useFactory: (repo: ITestDefinitionRepository) => new UpdateTestDefinition(repo),
      inject: [TEST_DEFINITION_REPOSITORY],
    },
    {
      provide: ListTestDefinitions,
      useFactory: (repo: ITestDefinitionRepository) => new ListTestDefinitions(repo),
      inject: [TEST_DEFINITION_REPOSITORY],
    },
    {
      provide: GetTestDefinition,
      useFactory: (repo: ITestDefinitionRepository) => new GetTestDefinition(repo),
      inject: [TEST_DEFINITION_REPOSITORY],
    },
  ],
  controllers: [TestDefinitionController],
})
export class TestDefinitionModule {}
