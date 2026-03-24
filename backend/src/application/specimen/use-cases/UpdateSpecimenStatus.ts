import { ISpecimenRepository } from '../../../domain/specimen/repositories/ISpecimenRepository';
import { SpecimenStatus } from '../../../domain/specimen/types/SpecimenStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { SpecimenDto } from '../dto/SpecimenDto';

// Allowed transitions per current status
const ALLOWED: Partial<Record<SpecimenStatus, SpecimenStatus[]>> = {
  [SpecimenStatus.COLLECTED]: [SpecimenStatus.RECEIVED, SpecimenStatus.REJECTED],
  [SpecimenStatus.RECEIVED]:  [SpecimenStatus.PROCESSED, SpecimenStatus.REJECTED],
  [SpecimenStatus.PROCESSED]: [SpecimenStatus.DISPOSED],
};

export class UpdateSpecimenStatus {
  constructor(private readonly specimenRepo: ISpecimenRepository) {}

  async execute(
    id: string,
    newStatus: SpecimenStatus,
    receivedAt?: Date,
  ): Promise<SpecimenDto> {
    const specimen = await this.specimenRepo.findById(id);
    if (!specimen) throw new DomainNotFoundException('Specimen', id);

    const allowed = ALLOWED[specimen.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new DomainValidationException(
        `Transition ${specimen.status} → ${newStatus} not allowed`,
      );
    }

    const updatedReceivedAt =
      newStatus === SpecimenStatus.RECEIVED ? (receivedAt ?? new Date()) : undefined;

    const updated = await this.specimenRepo.updateStatus(id, newStatus, updatedReceivedAt);
    return SpecimenDto.from(updated);
  }
}
