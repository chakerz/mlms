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
import { CurrentUser } from '../decorators/CurrentUser';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateOrder } from '../../../application/order/use-cases/CreateOrder';
import { GetOrderById } from '../../../application/order/use-cases/GetOrderById';
import { ListOrders } from '../../../application/order/use-cases/ListOrders';
import { UpdateOrderStatus } from '../../../application/order/use-cases/UpdateOrderStatus';
import { CancelOrder } from '../../../application/order/use-cases/CancelOrder';
import { ListSpecimensByOrder } from '../../../application/specimen/use-cases/ListSpecimensByOrder';
import { ListResultsByOrder } from '../../../application/result/use-cases/ListResultsByOrder';
import { CreateOrderDto } from '../../../application/order/dto/CreateOrderDto';
import { UpdateOrderStatusDto } from '../../../application/order/dto/UpdateOrderStatusDto';
import { JwtPayload } from '../../../infrastructure/security/jwt/JwtPayload';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrder: CreateOrder,
    private readonly getOrderById: GetOrderById,
    private readonly listOrders: ListOrders,
    private readonly updateOrderStatus: UpdateOrderStatus,
    private readonly cancelOrder: CancelOrder,
    private readonly listSpecimensByOrder: ListSpecimensByOrder,
    private readonly listResultsByOrder: ListResultsByOrder,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    return this.createOrder.execute(dto, user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION, UserRole.TECHNICIAN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'List orders' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'patientId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
  ) {
    return this.listOrders.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      patientId,
      status,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION, UserRole.TECHNICIAN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string) {
    return this.getOrderById.execute(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION, UserRole.TECHNICIAN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.updateOrderStatus.execute(id, dto.status);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Cancel an order' })
  cancel(@Param('id') id: string) {
    return this.cancelOrder.execute(id);
  }

  @Get(':id/specimens')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION, UserRole.TECHNICIAN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'List specimens for an order' })
  specimens(@Param('id') id: string) {
    return this.listSpecimensByOrder.execute(id);
  }

  @Get(':id/results')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'List all results for an order' })
  results(@Param('id') id: string) {
    return this.listResultsByOrder.execute(id);
  }
}
