import { Injectable, NotFoundException } from '@nestjs/common';
import { IInstrumentRepository } from '../../../domain/instrument/repositories/IInstrumentRepository';

@Injectable()
export class DeleteInstrument {
  constructor(private readonly instrumentRepository: IInstrumentRepository) {}

  async execute(id: string): Promise<void> {
    const instrument = await this.instrumentRepository.findById(id);
    if (!instrument) throw new NotFoundException(`Instrument ${id} not found`);
    await this.instrumentRepository.delete(id);
  }
}
