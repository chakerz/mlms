import { IQCResultRepository } from '../../../domain/qc/repositories/IQCResultRepository';
import { QCResultDto } from '../dto/QCResultDto';

export class GetQCResultById {
  constructor(private readonly repo: IQCResultRepository) {}

  async execute(id: string): Promise<QCResultDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new Error(`QCResult ${id} not found`);
    return QCResultDto.from(entity);
  }
}
