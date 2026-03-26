import { NotFoundException } from '@nestjs/common';
import { IInstrumentRawResultRepository } from '../../../domain/instrument/repositories/IInstrumentRawResultRepository';
import { InstrumentRawResultDto } from '../dto/InstrumentRawResultDto';

export class GetRawResult {
  constructor(private readonly repo: IInstrumentRawResultRepository) {}

  async execute(id: string): Promise<InstrumentRawResultDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new NotFoundException(`Raw result ${id} not found`);
    return InstrumentRawResultDto.from(entity);
  }
}
