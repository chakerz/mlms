import { Specimen } from '../entities/Specimen';
import { SpecimenStatus } from '../types/SpecimenStatus';

export interface ISpecimenRepository {
  findById(id: string): Promise<Specimen | null>;
  findByBarcode(barcode: string): Promise<Specimen | null>;
  findByOrderId(orderId: string): Promise<Specimen[]>;
  listAll(page: number, pageSize: number): Promise<{ specimens: Specimen[]; total: number }>;
  save(specimen: Specimen): Promise<Specimen>;
  updateStatus(id: string, status: SpecimenStatus, receivedAt?: Date): Promise<Specimen>;
}
