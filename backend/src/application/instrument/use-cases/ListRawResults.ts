import { IInstrumentRawResultRepository, ListRawResultsQuery } from '../../../domain/instrument/repositories/IInstrumentRawResultRepository';
import { InstrumentRawResultDto } from '../dto/InstrumentRawResultDto';

export class ListRawResults {
  constructor(private readonly repo: IInstrumentRawResultRepository) {}

  async execute(query: ListRawResultsQuery): Promise<{ data: InstrumentRawResultDto[]; total: number; page: number; pageSize: number }> {
    const { results, total } = await this.repo.list(query);
    return { data: results.map(InstrumentRawResultDto.from), total, page: query.page, pageSize: query.pageSize };
  }
}
