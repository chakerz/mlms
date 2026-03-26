import { IQCMaterialRepository } from '../../../domain/qc/repositories/IQCMaterialRepository';
import { QCMaterialDto } from '../dto/QCMaterialDto';

export class GetQCMaterialById {
  constructor(private readonly repo: IQCMaterialRepository) {}

  async execute(id: string): Promise<QCMaterialDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new Error(`QCMaterial ${id} not found`);
    return QCMaterialDto.from(entity);
  }
}
