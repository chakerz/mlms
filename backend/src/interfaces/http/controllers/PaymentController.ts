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
import { CreatePayment } from '../../../application/payment/use-cases/CreatePayment';
import { GetPaymentById } from '../../../application/payment/use-cases/GetPaymentById';
import { ListPayments } from '../../../application/payment/use-cases/ListPayments';
import { UpdatePaymentStatus } from '../../../application/payment/use-cases/UpdatePaymentStatus';
import { CreatePaymentDto } from '../../../application/payment/dto/CreatePaymentDto';
import { UpdatePaymentStatusDto } from '../../../application/payment/dto/UpdatePaymentStatusDto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly createPayment: CreatePayment,
    private readonly getPaymentById: GetPaymentById,
    private readonly listPayments: ListPayments,
    private readonly updatePaymentStatus: UpdatePaymentStatus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Create a new payment' })
  create(@Body() dto: CreatePaymentDto) {
    return this.createPayment.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'List payments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'invoiceId', required: false, type: String })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('patientId') patientId?: string,
    @Query('invoiceId') invoiceId?: string,
  ) {
    return this.listPayments.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      status,
      patientId,
      invoiceId,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.getPaymentById.execute(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Update payment status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.updatePaymentStatus.execute(id, dto.status);
  }
}
