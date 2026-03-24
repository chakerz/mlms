import { UserRole } from '../../../domain/common/types/UserRole';
import { Language } from '../../../domain/common/types/Language';

export class LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    language: Language;
  };
}
