import type { Gender, PaginationDto } from './common';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface RegisterPatientDto {
  firstName: string;
  lastName: string;
  /** ISO date string: YYYY-MM-DD */
  birthDate: string;
  gender: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  /** ISO date string: YYYY-MM-DD */
  birthDate?: string;
  gender?: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface PatientSearchDto extends PaginationDto {
  query?: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface PatientDto {
  id: string;
  firstName: string;
  lastName: string;
  /** ISO date string: YYYY-MM-DD */
  birthDate: string;
  gender: Gender;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}
