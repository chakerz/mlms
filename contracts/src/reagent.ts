import type { ReagentCategory } from './common';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateReagentDto {
  name: string;
  manufacturer: string;
  catalogNumber?: string | null;
  category: ReagentCategory;
  storageTemp?: string | null;
}

export interface ReceiveReagentLotDto {
  reagentId: string;
  lotNumber: string;
  /** ISO date string: YYYY-MM-DD */
  expiryDate: string;
  initialQuantity: number;
  currentQuantity?: number;
  storageLocation?: string | null;
}

export interface ConsumeReagentDto {
  reagentLotId: string;
  quantity: number;
  reason: string;
  orderId?: string | null;
  specimenId?: string | null;
  resultId?: string | null;
}

export interface BlockReagentLotDto {
  reason: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ReagentDto {
  id: string;
  name: string;
  manufacturer: string;
  catalogNumber: string | null;
  category: ReagentCategory;
  storageTemp: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReagentLotDto {
  id: string;
  reagentId: string;
  lotNumber: string;
  /** ISO date string: YYYY-MM-DD */
  expiryDate: string;
  initialQuantity: number;
  currentQuantity: number;
  isBlocked: boolean;
  storageLocation: string | null;
  createdAt: string;
  updatedAt: string;
}
