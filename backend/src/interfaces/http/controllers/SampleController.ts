import { Controller, Post, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateSample } from '../../../application/sample/use-cases/CreateSample';
import { GetSampleById } from '../../../application/sample/use-cases/GetSampleById';
import { ListSamples } from '../../../application/sample/use-cases/ListSamples';
import { UpdateSample } from '../../../application/sample/use-cases/UpdateSample';
import { CreateSampleInventoryLine } from '../../../application/sample/use-cases/CreateSampleInventoryLine';
import { GetSampleInventoryLineById } from '../../../application/sample/use-cases/GetSampleInventoryLineById';
import { ListSampleInventoryLines } from '../../../application/sample/use-cases/ListSampleInventoryLines';
import { UpdateSampleInventoryLine } from '../../../application/sample/use-cases/UpdateSampleInventoryLine';
import { CreateSampleDto, UpdateSampleDto } from '../../../application/sample/dto/SampleDto';
import { CreateSampleInventoryLineDto, UpdateSampleInventoryLineDto } from '../../../application/sample/dto/SampleInventoryLineDto';

const STOCK_ROLES = [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.RECEPTION];

@ApiTags('Samples')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('samples')
export class SampleController {
  constructor(
    private readonly createSample: CreateSample,
    private readonly getSampleById: GetSampleById,
    private readonly listSamples: ListSamples,
    private readonly updateSample: UpdateSample,
    private readonly createInventoryLine: CreateSampleInventoryLine,
    private readonly getInventoryLineById: GetSampleInventoryLineById,
    private readonly listInventoryLines: ListSampleInventoryLines,
    private readonly updateInventoryLine: UpdateSampleInventoryLine,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Create sample catalog entry' })
  create(@Body() dto: CreateSampleDto) { return this.createSample.execute(dto); }

  @Get()
  @Roles(...STOCK_ROLES)
  @ApiOperation({ summary: 'List samples' })
  list(@Query('page') page?: string, @Query('pageSize') pageSize?: string, @Query('search') search?: string, @Query('sampleType') sampleType?: string) {
    return this.listSamples.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, search, sampleType });
  }

  @Get(':id')
  @Roles(...STOCK_ROLES)
  @ApiOperation({ summary: 'Get sample' })
  findOne(@Param('id') id: string) { return this.getSampleById.execute(id); }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Update sample' })
  update(@Param('id') id: string, @Body() dto: UpdateSampleDto) { return this.updateSample.execute(id, dto); }

  // -- Inventory Lines --
  @Post('inventory')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Create inventory line' })
  createLine(@Body() dto: CreateSampleInventoryLineDto) { return this.createInventoryLine.execute(dto); }

  @Get('inventory/lines')
  @Roles(...STOCK_ROLES)
  @ApiOperation({ summary: 'List inventory lines' })
  listLines(@Query('page') page?: string, @Query('pageSize') pageSize?: string, @Query('sampleId') sampleId?: string, @Query('currentStatus') currentStatus?: string, @Query('search') search?: string) {
    return this.listInventoryLines.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, sampleId, currentStatus, search });
  }

  @Get('inventory/:id')
  @Roles(...STOCK_ROLES)
  @ApiOperation({ summary: 'Get inventory line' })
  getLine(@Param('id') id: string) { return this.getInventoryLineById.execute(id); }

  @Patch('inventory/:id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Update inventory line' })
  updateLine(@Param('id') id: string, @Body() dto: UpdateSampleInventoryLineDto) { return this.updateInventoryLine.execute(id, dto); }
}
