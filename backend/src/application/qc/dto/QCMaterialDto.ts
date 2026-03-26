import { QCMaterial } from '../../../domain/qc/entities/QCMaterial';

export class QCMaterialDto {
  id: string;
  barcode: string;
  name: string;
  lotNumber: string;
  manufacturer: string;
  expirationDate: string;
  expectedValue: number;
  standardDeviation: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static from(m: QCMaterial): QCMaterialDto {
    const dto = new QCMaterialDto();
    dto.id = m.id;
    dto.barcode = m.barcode;
    dto.name = m.name;
    dto.lotNumber = m.lotNumber;
    dto.manufacturer = m.manufacturer;
    dto.expirationDate = m.expirationDate.toISOString();
    dto.expectedValue = m.expectedValue;
    dto.standardDeviation = m.standardDeviation;
    dto.isActive = m.isActive;
    dto.createdAt = m.createdAt.toISOString();
    dto.updatedAt = m.updatedAt.toISOString();
    return dto;
  }
}

export class CreateQCMaterialDto {
  barcode: string;
  name: string;
  lotNumber: string;
  manufacturer: string;
  expirationDate: string;
  expectedValue: number;
  standardDeviation: number;
  isActive?: boolean;
}

export class UpdateQCMaterialDto {
  name?: string;
  lotNumber?: string;
  manufacturer?: string;
  expirationDate?: string;
  expectedValue?: number;
  standardDeviation?: number;
  isActive?: boolean;
}
