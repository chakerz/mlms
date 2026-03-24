import { UserRole } from '../../../domain/common/types/UserRole';
import { Language } from '../../../domain/common/types/Language';

export class MeDto {
  id: string;
  email: string;
  role: UserRole;
  language: Language;
  isActive: boolean;
}
