import type { Language, UserRole } from './common';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  role: UserRole;
  language?: Language;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface CurrentUserDto {
  id: string;
  email: string;
  role: UserRole;
  language: Language;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: CurrentUserDto;
}
