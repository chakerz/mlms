import { Controller, Post, Get, Patch, Delete, HttpCode, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateInstrument } from '../../../application/instrument/use-cases/CreateInstrument';
import { GetInstrumentById } from '../../../application/instrument/use-cases/GetInstrumentById';
import { ListInstruments } from '../../../application/instrument/use-cases/ListInstruments';
import { UpdateInstrument } from '../../../application/instrument/use-cases/UpdateInstrument';
import { SetInstrumentConnection } from '../../../application/instrument/use-cases/SetInstrumentConnection';
import { GetInstrumentConnection } from '../../../application/instrument/use-cases/GetInstrumentConnection';
import { CreateTestMapping } from '../../../application/instrument/use-cases/CreateTestMapping';
import { ListTestMappings } from '../../../application/instrument/use-cases/ListTestMappings';
import { UpdateTestMapping } from '../../../application/instrument/use-cases/UpdateTestMapping';
import { DeleteTestMapping } from '../../../application/instrument/use-cases/DeleteTestMapping';
import { ListOutboxMessages } from '../../../application/instrument/use-cases/ListOutboxMessages';
import { GetOutboxMessage } from '../../../application/instrument/use-cases/GetOutboxMessage';
import { RetryOutboxMessage } from '../../../application/instrument/use-cases/RetryOutboxMessage';
import { CancelOutboxMessage } from '../../../application/instrument/use-cases/CancelOutboxMessage';
import { ListInboxMessages } from '../../../application/instrument/use-cases/ListInboxMessages';
import { GetInboxMessage } from '../../../application/instrument/use-cases/GetInboxMessage';
import { ReprocessInboxMessage } from '../../../application/instrument/use-cases/ReprocessInboxMessage';
import { ListRawResults } from '../../../application/instrument/use-cases/ListRawResults';
import { GetRawResult } from '../../../application/instrument/use-cases/GetRawResult';
import { SendOrderToInstrument } from '../../../application/instrument/use-cases/SendOrderToInstrument';
import { DeleteInstrument } from '../../../application/instrument/use-cases/DeleteInstrument';
import { ListInstrumentCatalog } from '../../../application/instrument/use-cases/ListInstrumentCatalog';
import { CreateInstrumentCatalogEntry, CreateInstrumentCatalogEntryDto } from '../../../application/instrument/use-cases/CreateInstrumentCatalogEntry';
import { UpdateInstrumentCatalogEntry, UpdateInstrumentCatalogEntryDto } from '../../../application/instrument/use-cases/UpdateInstrumentCatalogEntry';
import { GetSimulatorConfig } from '../../../application/instrument/use-cases/GetSimulatorConfig';
import { UpsertSimulatorConfig, UpsertSimulatorConfigDto } from '../../../application/instrument/use-cases/UpsertSimulatorConfig';
import { CreateInstrumentDto, UpdateInstrumentDto } from '../../../application/instrument/dto/InstrumentDto';
import { UpsertInstrumentConnectionDto } from '../../../application/instrument/dto/InstrumentConnectionDto';
import { CreateInstrumentTestMappingDto, UpdateInstrumentTestMappingDto } from '../../../application/instrument/dto/InstrumentTestMappingDto';

const ADMIN_TECH = [UserRole.ADMIN, UserRole.TECHNICIAN];

@ApiTags('Instruments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('instruments')
export class InstrumentController {
  constructor(
    private readonly createInstrument: CreateInstrument,
    private readonly getInstrumentById: GetInstrumentById,
    private readonly listInstruments: ListInstruments,
    private readonly updateInstrument: UpdateInstrument,
    private readonly setInstrumentConnection: SetInstrumentConnection,
    private readonly getInstrumentConnection: GetInstrumentConnection,
    private readonly createTestMapping: CreateTestMapping,
    private readonly listTestMappings: ListTestMappings,
    private readonly updateTestMapping: UpdateTestMapping,
    private readonly deleteTestMapping: DeleteTestMapping,
    private readonly listOutboxMessages: ListOutboxMessages,
    private readonly getOutboxMessage: GetOutboxMessage,
    private readonly retryOutboxMessage: RetryOutboxMessage,
    private readonly cancelOutboxMessage: CancelOutboxMessage,
    private readonly listInboxMessages: ListInboxMessages,
    private readonly getInboxMessage: GetInboxMessage,
    private readonly reprocessInboxMessage: ReprocessInboxMessage,
    private readonly listRawResults: ListRawResults,
    private readonly getRawResult: GetRawResult,
    private readonly sendOrderToInstrument: SendOrderToInstrument,
    private readonly deleteInstrument: DeleteInstrument,
    private readonly listInstrumentCatalog: ListInstrumentCatalog,
    private readonly createInstrumentCatalogEntry: CreateInstrumentCatalogEntry,
    private readonly updateInstrumentCatalogEntry: UpdateInstrumentCatalogEntry,
    private readonly getSimulatorConfig: GetSimulatorConfig,
    private readonly upsertSimulatorConfig: UpsertSimulatorConfig,
  ) {}

  // -- Instrument Catalog --
  @Get('catalog')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'List instrument catalog' })
  listCatalog(@Query('search') search?: string) {
    return this.listInstrumentCatalog.execute(search);
  }

  @Post('catalog')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Add entry to instrument catalog' })
  createCatalogEntry(@Body() dto: CreateInstrumentCatalogEntryDto) {
    return this.createInstrumentCatalogEntry.execute(dto);
  }

  @Patch('catalog/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update catalog entry' })
  updateCatalogEntry(@Param('id') id: string, @Body() dto: UpdateInstrumentCatalogEntryDto) {
    return this.updateInstrumentCatalogEntry.execute(id, dto);
  }

  // -- Instruments --
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create instrument' })
  create(@Body() dto: CreateInstrumentDto) { return this.createInstrument.execute(dto); }

  @Get()
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'List instruments' })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.listInstruments.execute({
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 20,
      search,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete instrument' })
  remove(@Param('id') id: string) { return this.deleteInstrument.execute(id); }

  @Get('outbox/list')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'List outbox messages' })
  listOutbox(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('instrumentId') instrumentId?: string,
    @Query('status') status?: string,
  ) {
    return this.listOutboxMessages.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, instrumentId, status });
  }

  @Get('outbox/:id')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'Get outbox message' })
  getOutbox(@Param('id') id: string) { return this.getOutboxMessage.execute(id); }

  @Post('outbox/:id/retry')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Retry outbox message' })
  retryOutbox(@Param('id') id: string) { return this.retryOutboxMessage.execute(id); }

  @Post('outbox/:id/cancel')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel outbox message' })
  cancelOutbox(@Param('id') id: string) { return this.cancelOutboxMessage.execute(id); }

  @Get('inbox/list')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'List inbox messages' })
  listInbox(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('instrumentId') instrumentId?: string,
    @Query('importStatus') importStatus?: string,
    @Query('matchingStatus') matchingStatus?: string,
  ) {
    return this.listInboxMessages.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, instrumentId, importStatus, matchingStatus });
  }

  @Get('inbox/:id')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'Get inbox message' })
  getInbox(@Param('id') id: string) { return this.getInboxMessage.execute(id); }

  @Post('inbox/:id/reprocess')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reprocess inbox message' })
  reprocessInbox(@Param('id') id: string) { return this.reprocessInboxMessage.execute(id); }

  @Get('raw-results/list')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'List raw results' })
  listRaw(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('instrumentId') instrumentId?: string,
    @Query('specimenId') specimenId?: string,
    @Query('resultStatus') resultStatus?: string,
  ) {
    return this.listRawResults.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 20, instrumentId, specimenId, resultStatus });
  }

  @Get('raw-results/:id')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'Get raw result' })
  getRaw(@Param('id') id: string) { return this.getRawResult.execute(id); }

  // -- Send Order -- (must be before :id to avoid route conflict)
  @Post(':id/send-order')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'Send order worklist to instrument via ASTM TCP' })
  sendOrder(@Param('id') id: string, @Body() body: { orderId: string }) {
    return this.sendOrderToInstrument.execute(body.orderId, id);
  }

  @Get(':id')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'Get instrument' })
  findOne(@Param('id') id: string) { return this.getInstrumentById.execute(id); }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update instrument' })
  update(@Param('id') id: string, @Body() dto: UpdateInstrumentDto) { return this.updateInstrument.execute(id, dto); }

  // -- Connection --
  @Get(':id/connection')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'Get instrument connection' })
  getConnection(@Param('id') id: string) { return this.getInstrumentConnection.execute(id); }

  @Post(':id/connection')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Set instrument connection' })
  setConnection(@Param('id') id: string, @Body() dto: UpsertInstrumentConnectionDto) { return this.setInstrumentConnection.execute(id, dto); }

  // -- Simulator Config --
  @Get(':id/simulator-config')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'Get simulator config for instrument' })
  getSimConfig(@Param('id') id: string) { return this.getSimulatorConfig.execute(id); }

  @Post(':id/simulator-config')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Upsert simulator config for instrument' })
  upsertSimConfig(@Param('id') id: string, @Body() dto: UpsertSimulatorConfigDto) {
    return this.upsertSimulatorConfig.execute(id, dto);
  }

  // -- Mappings --
  @Get(':id/mappings')
  @Roles(...ADMIN_TECH)
  @ApiOperation({ summary: 'List test mappings for instrument' })
  listMappings(@Param('id') id: string) { return this.listTestMappings.execute(id); }

  @Post(':id/mappings')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create test mapping' })
  createMapping(@Param('id') id: string, @Body() dto: CreateInstrumentTestMappingDto) { return this.createTestMapping.execute(id, dto); }

  @Patch(':id/mappings/:mappingId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update test mapping' })
  updateMapping(@Param('mappingId') mappingId: string, @Body() dto: UpdateInstrumentTestMappingDto) { return this.updateTestMapping.execute(mappingId, dto); }

  @Delete(':id/mappings/:mappingId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete test mapping' })
  deleteMapping(@Param('mappingId') mappingId: string) { return this.deleteTestMapping.execute(mappingId); }
}
