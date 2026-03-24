import { ReagentLot } from '../../../domain/reagent/entities/ReagentLot';

export class ReagentLotDto {
  id!: string;
  reagentId!: string;
  lotNumber!: string;
  expiryDate!: string;
  initialQuantity!: number;
  currentQuantity!: number;
  isBlocked!: boolean;
  storageLocation!: string | null;
  isExpired!: boolean;
  createdAt!: string;
  updatedAt!: string;

  static from(l: ReagentLot): ReagentLotDto {
    const dto = new ReagentLotDto();
    dto.id = l.id;
    dto.reagentId = l.reagentId;
    dto.lotNumber = l.lotNumber;
    dto.expiryDate = l.expiryDate.toISOString();
    dto.initialQuantity = l.initialQuantity;
    dto.currentQuantity = l.currentQuantity;
    dto.isBlocked = l.isBlocked;
    dto.storageLocation = l.storageLocation;
    dto.isExpired = l.isExpired;
    dto.createdAt = l.createdAt.toISOString();
    dto.updatedAt = l.updatedAt.toISOString();
    return dto;
  }
}
