import { INonConformiteRepository } from '../../../domain/non-conformite/repositories/INonConformiteRepository';
import { NonConformiteDto, PaginatedNonConformitesDto } from '../dto/NonConformiteDto';

export class ListNonConformites {
  constructor(private readonly repo: INonConformiteRepository) {}

  async execute(page: number, pageSize: number): Promise<PaginatedNonConformitesDto> {
    const { data, total } = await this.repo.list(page, pageSize);
    const result = new PaginatedNonConformitesDto();
    result.data = data.map(NonConformiteDto.from);
    result.total = total;
    result.page = page;
    result.pageSize = pageSize;
    return result;
  }
}
