import { Gender } from '../../../domain/common/types/Gender';

export class PatientDto {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}
