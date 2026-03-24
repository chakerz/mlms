import { Reagent } from '../entities/Reagent';
import { ReagentLot } from '../entities/ReagentLot';

export interface ListReagentsQuery {
  page: number;
  pageSize: number;
  category?: string;
}

export interface IReagentRepository {
  findById(id: string): Promise<Reagent | null>;
  save(reagent: Reagent): Promise<Reagent>;
  list(query: ListReagentsQuery): Promise<{ reagents: Reagent[]; total: number }>;

  findLotById(id: string): Promise<ReagentLot | null>;
  saveLot(lot: ReagentLot): Promise<ReagentLot>;
  listLots(reagentId: string): Promise<ReagentLot[]>;
  updateLotQuantity(id: string, newQuantity: number): Promise<ReagentLot>;
}
