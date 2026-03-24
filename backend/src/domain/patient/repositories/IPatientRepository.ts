import { Patient } from '../entities/Patient';

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findByEmail(email: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
  list(page: number, pageSize: number): Promise<{ patients: Patient[]; total: number }>;
  search(query: string, page: number, pageSize: number): Promise<{ patients: Patient[]; total: number }>;
}
