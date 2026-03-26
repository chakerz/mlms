import { IQCMaterialRepository } from '../../../domain/qc/repositories/IQCMaterialRepository';
import { QCMaterialDto } from '../dto/QCMaterialDto';

export class ListQCMaterials {
  constructor(private readonly repo: IQCMaterialRepository) {}

  async execute(req: { page?: number; pageSize?: number; search?: string; isActive?: string }) {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;
    const { materials, total } = await this.repo.list({
      page, pageSize, search: req.search,
      isActive: req.isActive !== undefined ? req.isActive === 'true' : undefined,
    });
    return { data: materials.map(QCMaterialDto.from), total, page, pageSize };
  }
}
