import { Specimen } from '../../../domain/specimen/entities/Specimen';

export class SpecimenDto {
  id: string;
  orderId: string;
  barcode: string;
  type: string;
  containerType: string | null;
  status: string;
  collectionTime: string;
  preleveur: string | null;
  receivedAt: string | null;
  receivedBy: string | null;
  sentAt: string | null;
  transportConditions: string | null;
  conservedUntil: string | null;
  conservationSite: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  static from(s: Specimen): SpecimenDto {
    const dto = new SpecimenDto();
    dto.id = s.id;
    dto.orderId = s.orderId;
    dto.barcode = s.barcode;
    dto.type = s.type;
    dto.containerType = s.containerType;
    dto.status = s.status;
    dto.collectionTime = s.collectionTime.toISOString();
    dto.preleveur = s.preleveur;
    dto.receivedAt = s.receivedAt ? s.receivedAt.toISOString() : null;
    dto.receivedBy = s.receivedBy;
    dto.sentAt = s.sentAt ? s.sentAt.toISOString() : null;
    dto.transportConditions = s.transportConditions;
    dto.conservedUntil = s.conservedUntil ? s.conservedUntil.toISOString() : null;
    dto.conservationSite = s.conservationSite;
    dto.notes = s.notes;
    dto.createdAt = s.createdAt.toISOString();
    dto.updatedAt = s.updatedAt.toISOString();
    return dto;
  }
}
