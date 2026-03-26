import { Sample } from '../entities/Sample';

export interface ListSamplesQuery {
  page: number;
  pageSize: number;
  search?: string;
  sampleType?: string;
}

export interface ISampleRepository {
  findById(id: string): Promise<Sample | null>;
  save(sample: Sample): Promise<Sample>;
  update(id: string, data: Partial<Sample>): Promise<Sample>;
  list(query: ListSamplesQuery): Promise<{ samples: Sample[]; total: number }>;
}
