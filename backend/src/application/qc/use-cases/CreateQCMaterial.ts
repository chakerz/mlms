import { IQCMaterialRepository } from '../../../domain/qc/repositories/IQCMaterialRepository';
import { QCMaterial } from '../../../domain/qc/entities/QCMaterial';
import { CreateQCMaterialDto, QCMaterialDto } from '../dto/QCMaterialDto';

export class CreateQCMaterial {
  constructor(private readonly repo: IQCMaterialRepository) {}

  async execute(dto: CreateQCMaterialDto): Promise<QCMaterialDto> {
    const entity = new QCMaterial('', dto.barcode, dto.name, dto.lotNumber, dto.manufacturer,
      new Date(dto.expirationDate), dto.expectedValue, dto.standardDeviation,
      dto.isActive ?? true, new Date(), new Date());
    const saved = await this.repo.save(entity);
    return QCMaterialDto.from(saved);
  }
}
