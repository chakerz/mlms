import { NotFoundException } from '@nestjs/common';
import { IInstrumentOrderOutboxRepository } from '../../../domain/instrument/repositories/IInstrumentOrderOutboxRepository';
import { InstrumentOutboxDto } from '../dto/InstrumentOutboxDto';

export class GetOutboxMessage {
  constructor(private readonly repo: IInstrumentOrderOutboxRepository) {}

  async execute(id: string): Promise<InstrumentOutboxDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundException(`Outbox message ${id} not found`);
    return InstrumentOutboxDto.from(entity);
  }
}
