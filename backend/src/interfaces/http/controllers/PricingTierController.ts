import { Controller, Post, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreatePricingTier } from '../../../application/pricing/use-cases/CreatePricingTier';
import { GetPricingTierById } from '../../../application/pricing/use-cases/GetPricingTierById';
import { ListPricingTiers } from '../../../application/pricing/use-cases/ListPricingTiers';
import { UpdatePricingTier } from '../../../application/pricing/use-cases/UpdatePricingTier';
import { CreatePricingTierDto, UpdatePricingTierDto } from '../../../application/pricing/dto/PricingTierDto';

@ApiTags('Pricing Tiers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('pricing-tiers')
export class PricingTierController {
  constructor(
    private readonly createPricingTier: CreatePricingTier,
    private readonly getPricingTierById: GetPricingTierById,
    private readonly listPricingTiers: ListPricingTiers,
    private readonly updatePricingTier: UpdatePricingTier,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create pricing tier' })
  create(@Body() dto: CreatePricingTierDto) { return this.createPricingTier.execute(dto); }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'List pricing tiers' })
  list(@Query('page') page?: string, @Query('pageSize') pageSize?: string, @Query('isActive') isActive?: string) {
    return this.listPricingTiers.execute({ page: page ? +page : 1, pageSize: pageSize ? +pageSize : 50, isActive });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Get pricing tier' })
  findOne(@Param('id') id: string) { return this.getPricingTierById.execute(id); }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update pricing tier' })
  update(@Param('id') id: string, @Body() dto: UpdatePricingTierDto) { return this.updatePricingTier.execute(id, dto); }
}
