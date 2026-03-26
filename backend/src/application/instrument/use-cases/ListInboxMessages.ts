import { IInstrumentResultInboxRepository, ListInboxQuery } from '../../../domain/instrument/repositories/IInstrumentResultInboxRepository';
import { InstrumentInboxDto } from '../dto/InstrumentInboxDto';

export class ListInboxMessages {
  constructor(private readonly repo: IInstrumentResultInboxRepository) {}

  async execute(query: ListInboxQuery): Promise<{ data: InstrumentInboxDto[]; total: number; page: number; pageSize: number }> {
    const { messages, total } = await this.repo.list(query);
    return { data: messages.map(InstrumentInboxDto.from), total, page: query.page, pageSize: query.pageSize };
  }
}
