import { NotFoundException, BadRequestException } from '@nestjs/common';
import { IInstrumentOrderOutboxRepository } from '../../../domain/instrument/repositories/IInstrumentOrderOutboxRepository';
import { InstrumentOutboxDto } from '../dto/InstrumentOutboxDto';

export class CancelOutboxMessage {
  constructor(private readonly repo: IInstrumentOrderOutboxRepository) {}

  async execute(id: string): Promise<InstrumentOutboxDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundException(`Outbox message ${id} not found`);
    if (['ACK_RECEIVED', 'CANCELLED'].includes(entity.status)) {
      throw new BadRequestException(`Cannot cancel message in status ${entity.status}`);
    }
    const updated = await this.repo.update(id, { status: 'CANCELLED' });
    return InstrumentOutboxDto.from(updated);
  }
}
