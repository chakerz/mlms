export class Instrument {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly manufacturer: string | null,
    public readonly model: string | null,
    public readonly protocolType: string,
    public readonly transportType: string,
    public readonly directionMode: string,
    public readonly isActive: boolean,
    public readonly location: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
