import { Gender } from '../../common/types/Gender';

export class Patient {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly birthDate: Date,
    public readonly gender: Gender,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly address: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly bloodType: string | null = null,
    public readonly allergies: string | null = null,
    public readonly emergencyContactName: string | null = null,
    public readonly emergencyContactPhone: string | null = null,
    public readonly healthInsuranceNumber: string | null = null,
    public readonly pricingTierId: string | null = null,
  ) {}
}
