import { Practitioner } from '../entities/Practitioner';

export interface ListPractitionersQuery {
  page: number;
  pageSize: number;
  search?: string;
  speciality?: string;
  isActive?: boolean;
}

export interface IPractitionerRepository {
  findById(id: string): Promise<Practitioner | null>;
  save(practitioner: Practitioner): Promise<Practitioner>;
  update(id: string, data: Partial<Practitioner>): Promise<Practitioner>;
  list(query: ListPractitionersQuery): Promise<{ practitioners: Practitioner[]; total: number }>;
}
