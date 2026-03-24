import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NonConformite } from '../../../domain/non-conformite/entities/NonConformite';

export class NonConformiteDto {
  @ApiProperty() id!: string;
  @ApiPropertyOptional() specimenId!: string | null;
  @ApiPropertyOptional() orderId!: string | null;
  @ApiProperty() reason!: string;
  @ApiPropertyOptional() details!: string | null;
  @ApiProperty() action!: string;
  @ApiPropertyOptional() recordedBy!: string | null;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;

  static from(nc: NonConformite): NonConformiteDto {
    const dto = new NonConformiteDto();
    dto.id = nc.id;
    dto.specimenId = nc.specimenId;
    dto.orderId = nc.orderId;
    dto.reason = nc.reason;
    dto.details = nc.details;
    dto.action = nc.action;
    dto.recordedBy = nc.recordedBy;
    dto.createdAt = nc.createdAt.toISOString();
    dto.updatedAt = nc.updatedAt.toISOString();
    return dto;
  }
}

export class PaginatedNonConformitesDto {
  @ApiProperty({ type: [NonConformiteDto] }) data!: NonConformiteDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() pageSize!: number;
}
