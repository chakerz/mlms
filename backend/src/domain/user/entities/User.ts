import { UserRole } from '../../common/types/UserRole';
import { Language } from '../../common/types/Language';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly language: Language,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
