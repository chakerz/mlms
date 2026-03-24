import { ReagentCategory } from '../types/ReagentCategory';

export class Reagent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly manufacturer: string,
    public readonly catalogNumber: string | null,
    public readonly category: ReagentCategory,
    public readonly storageTemp: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
