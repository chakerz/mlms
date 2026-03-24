import type { SpecimenStatus, SpecimenType } from './common';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateSpecimenDto {
  orderId: string;
  barcode: string;
  type: SpecimenType;
  /** ISO datetime string */
  collectionTime: string;
  notes?: string | null;
}

export interface UpdateSpecimenStatusDto {
  status: SpecimenStatus;
  /** ISO datetime string – required when status is RECEIVED */
  receivedAt?: string | null;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface SpecimenDto {
  id: string;
  orderId: string;
  barcode: string;
  type: SpecimenType;
  status: SpecimenStatus;
  /** ISO datetime string */
  collectionTime: string;
  /** ISO datetime string */
  receivedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
