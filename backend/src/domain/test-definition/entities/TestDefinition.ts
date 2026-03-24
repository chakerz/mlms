import { ContainerType } from '../../specimen/types/ContainerType';

export class TestDefinition {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly nameFr: string,
    public readonly nameAr: string,
    public readonly category: string,
    public readonly unit: string | null,
    public readonly referenceLow: number | null,
    public readonly referenceHigh: number | null,
    public readonly isActive: boolean,
    public readonly tubeType: ContainerType | null,
    public readonly minVolumeMl: number | null,
    public readonly fastingRequired: boolean,
    public readonly lightSensitive: boolean,
    public readonly maxDelayMinutes: number | null,
    public readonly storageTemp: string | null,
    public readonly specialNotesFr: string | null,
    public readonly specialNotesAr: string | null,
    public readonly subcontracted: boolean,
    // Catalogue bilingue
    public readonly synonymes: string | null,
    public readonly sampleTypeFr: string | null,
    public readonly sampleTypeAr: string | null,
    public readonly tubeFr: string | null,
    public readonly tubeAr: string | null,
    public readonly method: string | null,
    public readonly collectionConditionFr: string | null,
    public readonly collectionConditionAr: string | null,
    public readonly preAnalyticDelay: string | null,
    public readonly preAnalyticDelayAr: string | null,
    public readonly turnaroundTime: string | null,
    public readonly turnaroundTimeAr: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
