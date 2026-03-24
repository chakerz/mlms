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
  ) {}
}
