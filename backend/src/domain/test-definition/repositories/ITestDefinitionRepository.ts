import { TestDefinition } from '../entities/TestDefinition';

export interface ListTestDefinitionsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  activeOnly?: boolean;
}

export interface PaginatedTestDefinitions {
  data: TestDefinition[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ITestDefinitionRepository {
  findById(id: string): Promise<TestDefinition | null>;
  findByCode(code: string): Promise<TestDefinition | null>;
  save(def: TestDefinition): Promise<TestDefinition>;
  list(query: ListTestDefinitionsQuery): Promise<PaginatedTestDefinitions>;
}

export const TEST_DEFINITION_REPOSITORY = 'TEST_DEFINITION_REPOSITORY';
