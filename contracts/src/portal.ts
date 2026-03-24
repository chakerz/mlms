import type { Gender, ReportStatus, ResultFlag } from './common';

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface PatientPortalProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  /** ISO date string: YYYY-MM-DD */
  birthDate: string;
  gender: Gender;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface PatientPortalResultDto {
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

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface PatientPortalReportDto {
  id: string;
  orderId: string;
  status: ReportStatus;
  /** ISO datetime string */
  publishedAt: string | null;
  patient: PatientPortalProfileDto;
  results: PatientPortalResultDto[];
  commentsFr: string | null;
  commentsAr: string | null;
}
