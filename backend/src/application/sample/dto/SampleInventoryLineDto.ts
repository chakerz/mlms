import { SampleInventoryLine } from '../../../domain/sample/entities/SampleInventoryLine';

export class SampleInventoryLineDto {
  id: string;
  barcode: string;
  inventoryCode: string;
  sampleId: string | null;
  receptionDate: string;
  receivedBy: string | null;
  currentLocation: string | null;
  currentStatus: string;
  quantity: number;
  unit: string | null;
  collectionDate: string | null;
  collectionSite: string | null;
  collectedBy: string | null;
  qcPassed: boolean;
  qcNotes: string | null;
  conservationMethod: string | null;
  expirationDate: string | null;
  history: unknown;
  createdAt: string;
  updatedAt: string;

  static from(l: SampleInventoryLine): SampleInventoryLineDto {
    const dto = new SampleInventoryLineDto();
    dto.id = l.id;
    dto.barcode = l.barcode;
    dto.inventoryCode = l.inventoryCode;
    dto.sampleId = l.sampleId;
    dto.receptionDate = l.receptionDate.toISOString();
    dto.receivedBy = l.receivedBy;
    dto.currentLocation = l.currentLocation;
    dto.currentStatus = l.currentStatus;
    dto.quantity = l.quantity;
    dto.unit = l.unit;
    dto.collectionDate = l.collectionDate?.toISOString() ?? null;
    dto.collectionSite = l.collectionSite;
    dto.collectedBy = l.collectedBy;
    dto.qcPassed = l.qcPassed;
    dto.qcNotes = l.qcNotes;
    dto.conservationMethod = l.conservationMethod;
    dto.expirationDate = l.expirationDate?.toISOString() ?? null;
    dto.history = l.history;
    dto.createdAt = l.createdAt.toISOString();
    dto.updatedAt = l.updatedAt.toISOString();
    return dto;
  }
}

export class CreateSampleInventoryLineDto {
  barcode: string;
  inventoryCode: string;
  sampleId?: string;
  receptionDate: string;
  receivedBy?: string;
  currentLocation?: string;
  currentStatus?: string;
  quantity?: number;
  unit?: string;
  collectionDate?: string;
  collectionSite?: string;
  collectedBy?: string;
  qcPassed?: boolean;
  qcNotes?: string;
  conservationMethod?: string;
  expirationDate?: string;
}

export class UpdateSampleInventoryLineDto {
  currentLocation?: string | null;
  currentStatus?: string;
  qcPassed?: boolean;
  qcNotes?: string | null;
  conservationMethod?: string | null;
}
