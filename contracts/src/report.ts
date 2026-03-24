import type { ReportStatus, ResultFlag } from './common';

// ─── Sub-types ────────────────────────────────────────────────────────────────

/** Embedded result snapshot inside a report response */
export interface ReportResultDto {
  id: string;
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
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface GenerateReportDto {
  orderId: string;
  templateVersion?: string;
}

export interface ValidateReportDto {
  commentsFr?: string | null;
  commentsAr?: string | null;
}

export interface SignReportDto {
  commentsFr?: string | null;
  commentsAr?: string | null;
}

export interface PublishReportDto {
  publishToPortal: boolean;
}

export interface CorrectReportDto {
  commentsFr?: string | null;
  commentsAr?: string | null;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ReportDto {
  id: string;
  orderId: string;
  status: ReportStatus;
  commentsFr: string | null;
  commentsAr: string | null;
  validatedBy: string | null;
  /** ISO datetime string */
  validatedAt: string | null;
  signedBy: string | null;
  /** ISO datetime string */
  signedAt: string | null;
  /** ISO datetime string */
  publishedAt: string | null;
  templateVersion: string;
  createdAt: string;
  updatedAt: string;
  results?: ReportResultDto[];
}
