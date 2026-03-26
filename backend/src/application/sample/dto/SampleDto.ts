import { Sample } from '../../../domain/sample/entities/Sample';

export class SampleDto {
  id: string;
  sampleCode: string;
  name: string;
  sampleType: string;
  sampleDescription: string | null;
  collectionMethod: string | null;
  containerType: string | null;
  storageConditions: string | null;
  handlingInstructions: string | null;
  sampleStatus: string;
  qcPassed: boolean;
  qcNotes: string | null;
  createdAt: string;
  updatedAt: string;

  static from(s: Sample): SampleDto {
    const dto = new SampleDto();
    dto.id = s.id;
    dto.sampleCode = s.sampleCode;
    dto.name = s.name;
    dto.sampleType = s.sampleType;
    dto.sampleDescription = s.sampleDescription;
    dto.collectionMethod = s.collectionMethod;
    dto.containerType = s.containerType;
    dto.storageConditions = s.storageConditions;
    dto.handlingInstructions = s.handlingInstructions;
    dto.sampleStatus = s.sampleStatus;
    dto.qcPassed = s.qcPassed;
    dto.qcNotes = s.qcNotes;
    dto.createdAt = s.createdAt.toISOString();
    dto.updatedAt = s.updatedAt.toISOString();
    return dto;
  }
}

export class CreateSampleDto {
  sampleCode: string;
  name: string;
  sampleType: string;
  sampleDescription?: string;
  collectionMethod?: string;
  containerType?: string;
  storageConditions?: string;
  handlingInstructions?: string;
  sampleStatus?: string;
  qcPassed?: boolean;
  qcNotes?: string;
}

export class UpdateSampleDto {
  name?: string;
  sampleType?: string;
  sampleDescription?: string | null;
  collectionMethod?: string | null;
  containerType?: string | null;
  storageConditions?: string | null;
  handlingInstructions?: string | null;
  sampleStatus?: string;
  qcPassed?: boolean;
  qcNotes?: string | null;
}
