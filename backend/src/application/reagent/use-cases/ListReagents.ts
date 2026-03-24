import { IReagentRepository, ListReagentsQuery } from '../../../domain/reagent/repositories/IReagentRepository';
import { ReagentDto } from '../dto/ReagentDto';

export class ListReagents {
  constructor(private readonly repo: IReagentRepository) {}

  async execute(query: ListReagentsQuery): Promise<{ data: ReagentDto[]; total: number; page: number; pageSize: number }> {
    const { reagents, total } = await this.repo.list(query);
    return {
      data: reagents.map(ReagentDto.from),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }
}
