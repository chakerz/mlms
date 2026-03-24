import { NotFoundException } from '@nestjs/common';
import { ITestDefinitionRepository } from '../../../domain/test-definition/repositories/ITestDefinitionRepository';
import { TestDefinitionDto } from '../dto/TestDefinitionDto';

export class GetTestDefinition {
  constructor(private readonly repo: ITestDefinitionRepository) {}

  async execute(id: string): Promise<TestDefinitionDto> {
    const def = await this.repo.findById(id);
    if (!def) {
      throw new NotFoundException(`TestDefinition ${id} not found`);
    }
    return TestDefinitionDto.from(def);
  }
}
