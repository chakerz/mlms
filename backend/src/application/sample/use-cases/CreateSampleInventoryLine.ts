import { ISampleInventoryLineRepository } from '../../../domain/sample/repositories/ISampleInventoryLineRepository';
import { SampleInventoryLine } from '../../../domain/sample/entities/SampleInventoryLine';
import { CreateSampleInventoryLineDto, SampleInventoryLineDto } from '../dto/SampleInventoryLineDto';

export class CreateSampleInventoryLine {
  constructor(private readonly repo: ISampleInventoryLineRepository) {}

  async execute(dto: CreateSampleInventoryLineDto): Promise<SampleInventoryLineDto> {
    const entity = new SampleInventoryLine('', dto.barcode, dto.inventoryCode, dto.sampleId ?? null,
      new Date(dto.receptionDate), dto.receivedBy ?? null, dto.currentLocation ?? null,
      dto.currentStatus ?? 'RECEIVED', dto.quantity ?? 1, dto.unit ?? null,
      dto.collectionDate ? new Date(dto.collectionDate) : null,
      dto.collectionSite ?? null, dto.collectedBy ?? null, dto.qcPassed ?? false,
      dto.qcNotes ?? null, dto.conservationMethod ?? null,
      dto.expirationDate ? new Date(dto.expirationDate) : null, null, new Date(), new Date());
    const saved = await this.repo.save(entity);
    return SampleInventoryLineDto.from(saved);
  }
}
