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
import { CreateInvoice } from '../../../application/invoice/use-cases/CreateInvoice';
import { GetInvoiceById } from '../../../application/invoice/use-cases/GetInvoiceById';
import { ListInvoices } from '../../../application/invoice/use-cases/ListInvoices';
import { UpdateInvoiceStatus } from '../../../application/invoice/use-cases/UpdateInvoiceStatus';
import { CreateInvoiceDto } from '../../../application/invoice/dto/CreateInvoiceDto';
import { UpdateInvoiceStatusDto } from '../../../application/invoice/dto/UpdateInvoiceStatusDto';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly createInvoice: CreateInvoice,
    private readonly getInvoiceById: GetInvoiceById,
    private readonly listInvoices: ListInvoices,
    private readonly updateInvoiceStatus: UpdateInvoiceStatus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Create a new invoice' })
  create(@Body() dto: CreateInvoiceDto) {
    return this.createInvoice.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'List invoices' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('patientId') patientId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.listInvoices.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      status,
      patientId,
      dateFrom,
      dateTo,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Get invoice by ID' })
  findOne(@Param('id') id: string) {
    return this.getInvoiceById.execute(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Update invoice status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInvoiceStatusDto) {
    return this.updateInvoiceStatus.execute(id, dto.status);
  }
}
