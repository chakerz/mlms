import { IQCResultRepository } from '../../../domain/qc/repositories/IQCResultRepository';
import { UpdateQCResultDto, QCResultDto } from '../dto/QCResultDto';

export class UpdateQCResult {
  constructor(private readonly repo: IQCResultRepository) {}

  async execute(id: string, dto: UpdateQCResultDto): Promise<QCResultDto> {
    const updated = await this.repo.update(id, dto as never);
    return QCResultDto.from(updated);
  }
}
