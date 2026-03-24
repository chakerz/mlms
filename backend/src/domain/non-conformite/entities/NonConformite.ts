import { NonConformiteReason } from '../types/NonConformiteReason';
import { ConformiteAction } from '../types/ConformiteAction';

export class NonConformite {
  constructor(
    public readonly id: string,
    public readonly specimenId: string | null,
    public readonly orderId: string | null,
    public readonly reason: NonConformiteReason,
    public readonly details: string | null,
    public readonly action: ConformiteAction,
    public readonly recordedBy: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
