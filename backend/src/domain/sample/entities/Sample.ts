export class Sample {
  constructor(
    public readonly id: string,
    public readonly sampleCode: string,
    public readonly name: string,
    public readonly sampleType: string,
    public readonly sampleDescription: string | null,
    public readonly collectionMethod: string | null,
    public readonly containerType: string | null,
    public readonly storageConditions: string | null,
    public readonly handlingInstructions: string | null,
    public readonly sampleStatus: string,
    public readonly qcPassed: boolean,
    public readonly qcNotes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
