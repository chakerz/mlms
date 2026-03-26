import { NotFoundException } from '@nestjs/common';
import { IInstrumentResultInboxRepository } from '../../../domain/instrument/repositories/IInstrumentResultInboxRepository';
import { InstrumentInboxDto } from '../dto/InstrumentInboxDto';

export class GetInboxMessage {
  constructor(private readonly repo: IInstrumentResultInboxRepository) {}

  async execute(id: string): Promise<InstrumentInboxDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundException(`Inbox message ${id} not found`);
    return InstrumentInboxDto.from(entity);
  }
}
