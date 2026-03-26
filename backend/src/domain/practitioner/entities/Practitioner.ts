export class Practitioner {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phoneNumber: string | null,
    public readonly address: string | null,
    public readonly speciality: string | null,
    public readonly qualification: string | null,
    public readonly licenseNumber: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
