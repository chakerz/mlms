import { IQCMaterialRepository } from '../../../domain/qc/repositories/IQCMaterialRepository';
import { UpdateQCMaterialDto, QCMaterialDto } from '../dto/QCMaterialDto';

export class UpdateQCMaterial {
  constructor(private readonly repo: IQCMaterialRepository) {}

  async execute(id: string, dto: UpdateQCMaterialDto): Promise<QCMaterialDto> {
    const data: Record<string, unknown> = { ...dto };
    if (dto.expirationDate) data['expirationDate'] = new Date(dto.expirationDate);
    const updated = await this.repo.update(id, data as never);
    return QCMaterialDto.from(updated);
  }
}
