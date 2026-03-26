import { QCMaterial } from '../entities/QCMaterial';

export interface ListQCMaterialsQuery {
  page: number;
  pageSize: number;
  search?: string;
  isActive?: boolean;
}

export interface IQCMaterialRepository {
  findById(id: string): Promise<QCMaterial | null>;
  save(material: QCMaterial): Promise<QCMaterial>;
  update(id: string, data: Partial<QCMaterial>): Promise<QCMaterial>;
  list(query: ListQCMaterialsQuery): Promise<{ materials: QCMaterial[]; total: number }>;
}
