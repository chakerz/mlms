import { ISpecimenRepository } from '../../../domain/specimen/repositories/ISpecimenRepository';
import { IOrderRepository } from '../../../domain/order/repositories/IOrderRepository';
import { Specimen } from '../../../domain/specimen/entities/Specimen';
import { SpecimenStatus } from '../../../domain/specimen/types/SpecimenStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { ConflictDomainException } from '../../../domain/common/exceptions/ConflictDomainException';
import { CreateSpecimenDto } from '../dto/CreateSpecimenDto';
import { SpecimenDto } from '../dto/SpecimenDto';

function generateBarcode(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LAB-${y}${m}${d}-${rand}`;
}

export class CreateSpecimen {
  constructor(
    private readonly specimenRepo: ISpecimenRepository,
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(dto: CreateSpecimenDto): Promise<SpecimenDto> {
    const order = await this.orderRepo.findById(dto.orderId);
    if (!order) throw new DomainNotFoundException('Order', dto.orderId);

    const barcode = dto.barcode ?? generateBarcode();

    const existing = await this.specimenRepo.findByBarcode(barcode);
    if (existing) throw new ConflictDomainException(`Barcode '${barcode}' already exists`);

    const specimen = new Specimen(
      '',
      dto.orderId,
      barcode,
      dto.type,
      dto.containerType ?? null,
      SpecimenStatus.COLLECTED,
      new Date(dto.collectionTime),
      dto.preleveur ?? null,
      null,
      null,
      dto.sentAt ? new Date(dto.sentAt) : null,
      dto.transportConditions ?? null,
      dto.conservedUntil ? new Date(dto.conservedUntil) : null,
      dto.conservationSite ?? null,
      dto.notes ?? null,
      new Date(),
      new Date(),
    );

    const saved = await this.specimenRepo.save(specimen);
    return SpecimenDto.from(saved);
  }
}
