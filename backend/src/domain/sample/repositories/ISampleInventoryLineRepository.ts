import { SampleInventoryLine } from '../entities/SampleInventoryLine';

export interface ListInventoryLinesQuery {
  page: number;
  pageSize: number;
  sampleId?: string;
  currentStatus?: string;
  search?: string;
}

export interface ISampleInventoryLineRepository {
  findById(id: string): Promise<SampleInventoryLine | null>;
  save(line: SampleInventoryLine): Promise<SampleInventoryLine>;
  update(id: string, data: Partial<SampleInventoryLine>): Promise<SampleInventoryLine>;
  list(query: ListInventoryLinesQuery): Promise<{ lines: SampleInventoryLine[]; total: number }>;
}
