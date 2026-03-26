import { IInstrumentOrderOutboxRepository, ListOutboxQuery } from '../../../domain/instrument/repositories/IInstrumentOrderOutboxRepository';
import { InstrumentOutboxDto } from '../dto/InstrumentOutboxDto';

export class ListOutboxMessages {
  constructor(private readonly repo: IInstrumentOrderOutboxRepository) {}

  async execute(query: ListOutboxQuery): Promise<{ data: InstrumentOutboxDto[]; total: number; page: number; pageSize: number }> {
    const { messages, total } = await this.repo.list(query);
    return { data: messages.map(InstrumentOutboxDto.from), total, page: query.page, pageSize: query.pageSize };
  }
}
