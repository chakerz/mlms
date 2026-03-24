import { Reagent } from '../../../domain/reagent/entities/Reagent';

export class ReagentDto {
  id!: string;
  name!: string;
  manufacturer!: string;
  catalogNumber!: string | null;
  category!: string;
  storageTemp!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static from(r: Reagent): ReagentDto {
    const dto = new ReagentDto();
    dto.id = r.id;
    dto.name = r.name;
    dto.manufacturer = r.manufacturer;
    dto.catalogNumber = r.catalogNumber;
    dto.category = r.category;
    dto.storageTemp = r.storageTemp;
    dto.createdAt = r.createdAt.toISOString();
    dto.updatedAt = r.updatedAt.toISOString();
    return dto;
  }
}
