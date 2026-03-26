import { IInstrumentRepository, ListInstrumentsQuery } from '../../../domain/instrument/repositories/IInstrumentRepository';
import { InstrumentDto } from '../dto/InstrumentDto';

export class ListInstruments {
  constructor(private readonly repo: IInstrumentRepository) {}

  async execute(query: ListInstrumentsQuery): Promise<{ data: InstrumentDto[]; total: number; page: number; pageSize: number }> {
    const { instruments, total } = await this.repo.list(query);
    return { data: instruments.map(InstrumentDto.from), total, page: query.page, pageSize: query.pageSize };
  }
}
