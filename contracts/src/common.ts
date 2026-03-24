// ─── Enums ────────────────────────────────────────────────────────────────────

export type Language = 'FR' | 'AR';

export type UserRole = 'RECEPTION' | 'TECHNICIAN' | 'PHYSICIAN' | 'ADMIN';

export type Gender = 'M' | 'F' | 'O';

export type OrderPriority = 'ROUTINE' | 'URGENT' | 'STAT';

export type OrderStatus =
  | 'PENDING'
  | 'COLLECTED'
  | 'ANALYZED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'CANCELLED';

export type SpecimenType = 'BLOOD' | 'URINE' | 'STOOL' | 'TISSUE';

export type SpecimenStatus =
  | 'COLLECTED'
  | 'RECEIVED'
  | 'PROCESSED'
  | 'DISPOSED'
  | 'REJECTED';

export type ResultFlag = 'N' | 'H' | 'L' | 'HH' | 'LL' | 'CRITICAL';

export type ReportStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'FINAL'
  | 'CORRECTED'
  | 'PUBLISHED';

export type ReagentCategory =
  | 'CHEMISTRY'
  | 'HEMATOLOGY'
  | 'IMMUNOLOGY'
  | 'MICROBIOLOGY';

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationDto {
  page?: number;
  pageSize?: number;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PaginatedMeta;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorDto {
  statusCode: number;
  error: string;
  message: string;
  details?: ValidationErrorDetail[];
}
