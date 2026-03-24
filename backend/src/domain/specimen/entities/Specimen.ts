import { SpecimenType } from '../types/SpecimenType';
import { SpecimenStatus } from '../types/SpecimenStatus';
import { ContainerType } from '../types/ContainerType';

export class Specimen {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly barcode: string,
    public readonly type: SpecimenType,
    public readonly containerType: ContainerType | null,
    public readonly status: SpecimenStatus,
    public readonly collectionTime: Date,
    public readonly preleveur: string | null,
    public readonly receivedAt: Date | null,
    public readonly receivedBy: string | null,
    public readonly sentAt: Date | null,
    public readonly transportConditions: string | null,
    public readonly conservedUntil: Date | null,
    public readonly conservationSite: string | null,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
