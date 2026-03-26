import { IPractitionerRepository, ListPractitionersQuery } from '../../../domain/practitioner/repositories/IPractitionerRepository';
import { PractitionerDto } from '../dto/PractitionerDto';

export interface ListPractitionersRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  speciality?: string;
  isActive?: string;
}

export class ListPractitioners {
  constructor(private readonly practitionerRepo: IPractitionerRepository) {}

  async execute(req: ListPractitionersRequest): Promise<{ data: PractitionerDto[]; total: number; page: number; pageSize: number }> {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;

    const query: ListPractitionersQuery = {
      page,
      pageSize,
      search: req.search,
      speciality: req.speciality,
      isActive: req.isActive !== undefined ? req.isActive === 'true' : undefined,
    };

    const { practitioners, total } = await this.practitionerRepo.list(query);
    return { data: practitioners.map(PractitionerDto.from), total, page, pageSize };
  }
}
