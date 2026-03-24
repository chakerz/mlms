import { ITestDefinitionRepository, ListTestDefinitionsQuery } from '../../../domain/test-definition/repositories/ITestDefinitionRepository';
import { PaginatedTestDefinitionsDto, TestDefinitionDto } from '../dto/TestDefinitionDto';

export class ListTestDefinitions {
  constructor(private readonly repo: ITestDefinitionRepository) {}

  async execute(query: ListTestDefinitionsQuery): Promise<PaginatedTestDefinitionsDto> {
    const result = await this.repo.list(query);
    return {
      data: result.data.map(TestDefinitionDto.from),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
