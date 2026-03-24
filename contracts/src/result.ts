import type { ResultFlag } from './common';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface RecordResultDto {
  specimenId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag: ResultFlag;
  /** ISO datetime string */
  measuredAt: string;
  measuredBy?: string | null;
}

export interface UpdateResultDto {
  value?: string;
  unit?: string | null;
  referenceLow?: number | null;
  referenceHigh?: number | null;
  flag?: ResultFlag;
  /** ISO datetime string */
  measuredAt?: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ResultDto {
  id: string;
  specimenId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  flag: ResultFlag;
  /** ISO datetime string */
  measuredAt: string;
  measuredBy: string | null;
  createdAt: string;
  updatedAt: string;
}
