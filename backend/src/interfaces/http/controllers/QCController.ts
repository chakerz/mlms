import { Controller, Post, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateQCMaterial } from '../../../application/qc/use-cases/CreateQCMaterial';
import { GetQCMaterialById } from '../../../application/qc/use-cases/GetQCMaterialById';
import { ListQCMaterials } from '../../../application/qc/use-cases/ListQCMaterials';
import { UpdateQCMaterial } from '../../../application/qc/use-cases/UpdateQCMaterial';
import { CreateQCSchedule } from '../../../application/qc/use-cases/CreateQCSchedule';
import { GetQCScheduleById } from '../../../application/qc/use-cases/GetQCScheduleById';
import { ListQCSchedules } from '../../../application/qc/use-cases/ListQCSchedules';
import { UpdateQCSchedule } from '../../../application/qc/use-cases/UpdateQCSchedule';
import { CreateQCResult } from '../../../application/qc/use-cases/CreateQCResult';
import { GetQCResultById } from '../../../application/qc/use-cases/GetQCResultById';
import { ListQCResults } from '../../../application/qc/use-cases/ListQCResults';
import { UpdateQCResult } from '../../../application/qc/use-cases/UpdateQCResult';
import { CreateQCMaterialDto, UpdateQCMaterialDto } from '../../../application/qc/dto/QCMaterialDto';
import { CreateQCScheduleDto, UpdateQCScheduleDto } from '../../../application/qc/dto/QCScheduleDto';
import { CreateQCResultDto, UpdateQCResultDto } from '../../../application/qc/dto/QCResultDto';

const ALL_ROLES = [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.PHYSICIAN, UserRole.RECEPTION];

@ApiTags('QC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('qc')
export class QCController {
  constructor(
    private readonly createQCMaterial: CreateQCMaterial,
    private readonly getQCMaterialById: GetQCMaterialById,
    private readonly listQCMaterials: ListQCMaterials,
    private readonly updateQCMaterial: UpdateQCMaterial,
    private readonly createQCSchedule: CreateQCSchedule,
    private readonly getQCScheduleById: GetQCScheduleById,
    private readonly listQCSchedules: ListQCSchedules,
    private readonly updateQCSchedule: UpdateQCSchedule,
    private readonly createQCResult: CreateQCResult,
    private readonly getQCResultById: GetQCResultById,
    private readonly listQCResults: ListQCResults,
    private readonly updateQCResult: UpdateQCResult,
  ) {}

  // -- QCMaterial --
  @Post('materials')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'Create QC material' })
  createMaterial(@Body() dto: CreateQCMaterialDto) { return this.createQCMaterial.execute(dto); }

  @Get('materials')
  @Roles(...ALL_ROLES)
  @ApiOperation({ summary: 'List QC materials' })
  listMaterials(@Query('page') page?: string, @Query('pageSize') pageSize?: string, @Query('search') search?: string, @Query('isActive') isActive?: string) {
    return this.listQCMaterials.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, search, isActive });
  }

  @Get('materials/:id')
  @Roles(...ALL_ROLES)
  @ApiOperation({ summary: 'Get QC material' })
  getMaterial(@Param('id') id: string) { return this.getQCMaterialById.execute(id); }

  @Patch('materials/:id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'Update QC material' })
  updateMaterial(@Param('id') id: string, @Body() dto: UpdateQCMaterialDto) { return this.updateQCMaterial.execute(id, dto); }

  // -- QCSchedule --
  @Post('schedules')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'Create QC schedule' })
  createSchedule(@Body() dto: CreateQCScheduleDto) { return this.createQCSchedule.execute(dto); }

  @Get('schedules')
  @Roles(...ALL_ROLES)
  @ApiOperation({ summary: 'List QC schedules' })
  listSchedules(@Query('page') page?: string, @Query('pageSize') pageSize?: string, @Query('status') status?: string) {
    return this.listQCSchedules.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, status });
  }

  @Get('schedules/:id')
  @Roles(...ALL_ROLES)
  @ApiOperation({ summary: 'Get QC schedule' })
  getSchedule(@Param('id') id: string) { return this.getQCScheduleById.execute(id); }

  @Patch('schedules/:id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'Update QC schedule' })
  updateSchedule(@Param('id') id: string, @Body() dto: UpdateQCScheduleDto) { return this.updateQCSchedule.execute(id, dto); }

  // -- QCResult --
  @Post('results')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'Create QC result' })
  createResult(@Body() dto: CreateQCResultDto) { return this.createQCResult.execute(dto); }

  @Get('results')
  @Roles(...ALL_ROLES)
  @ApiOperation({ summary: 'List QC results' })
  listResults(@Query('page') page?: string, @Query('pageSize') pageSize?: string, @Query('status') status?: string, @Query('alert') alert?: string, @Query('qcScheduleId') qcScheduleId?: string) {
    return this.listQCResults.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, status, alert, qcScheduleId });
  }

  @Get('results/:id')
  @Roles(...ALL_ROLES)
  @ApiOperation({ summary: 'Get QC result' })
  getResult(@Param('id') id: string) { return this.getQCResultById.execute(id); }

  @Patch('results/:id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'Update QC result' })
  updateResult(@Param('id') id: string, @Body() dto: UpdateQCResultDto) { return this.updateQCResult.execute(id, dto); }
}
