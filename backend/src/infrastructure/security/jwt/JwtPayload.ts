import { UserRole } from '../../../domain/common/types/UserRole';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
