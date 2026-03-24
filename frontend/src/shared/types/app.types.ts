export type AppLanguage = 'fr' | 'ar'
export type Direction = 'ltr' | 'rtl'

export enum UserRole {
  RECEPTION = 'RECEPTION',
  TECHNICIAN = 'TECHNICIAN',
  PHYSICIAN = 'PHYSICIAN',
  BIOLOGISTE = 'BIOLOGISTE',
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
}

export interface AuthUser {
  id: string
  email: string
  role: string
  language: string
  isActive?: boolean
}
