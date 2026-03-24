import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateSpecimen } from '../../../application/specimen/use-cases/CreateSpecimen';
import { GetSpecimenById } from '../../../application/specimen/use-cases/GetSpecimenById';
import { UpdateSpecimenStatus } from '../../../application/specimen/use-cases/UpdateSpecimenStatus';
import { ListAllSpecimens } from '../../../application/specimen/use-cases/ListAllSpecimens';
import { ListResultsBySpecimen } from '../../../application/result/use-cases/ListResultsBySpecimen';
import { CreateSpecimenDto } from '../../../application/specimen/dto/CreateSpecimenDto';
import { UpdateSpecimenStatusDto } from '../../../application/specimen/dto/UpdateSpecimenStatusDto';

@ApiTags('Specimens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('specimens')
export class SpecimenController {
  constructor(
    private readonly createSpecimen: CreateSpecimen,
    private readonly getSpecimenById: GetSpecimenById,
    private readonly updateSpecimenStatus: UpdateSpecimenStatus,
    private readonly listAllSpecimens: ListAllSpecimens,
    private readonly listResultsBySpecimen: ListResultsBySpecimen,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'List all specimens (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  listAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.listAllSpecimens.execute(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Create a specimen for an order' })
  create(@Body() dto: CreateSpecimenDto) {
    return this.createSpecimen.execute(dto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Get specimen by ID' })
  findOne(@Param('id') id: string) {
    return this.getSpecimenById.execute(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Update specimen status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSpecimenStatusDto) {
    return this.updateSpecimenStatus.execute(
      id,
      dto.status,
      dto.receivedAt ? new Date(dto.receivedAt) : undefined,
    );
  }

  @Get(':id/results')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'List results for a specimen' })
  results(@Param('id') id: string) {
    return this.listResultsBySpecimen.execute(id);
  }
}
