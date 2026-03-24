import { NonConformite } from '../entities/NonConformite';

export const NON_CONFORMITE_REPOSITORY = 'NON_CONFORMITE_REPOSITORY';

export interface INonConformiteRepository {
  save(nc: NonConformite): Promise<NonConformite>;
  findById(id: string): Promise<NonConformite | null>;
  findBySpecimen(specimenId: string): Promise<NonConformite[]>;
  findByOrder(orderId: string): Promise<NonConformite[]>;
  list(page: number, pageSize: number): Promise<{ data: NonConformite[]; total: number }>;
}
