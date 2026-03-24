import { Controller, Post, Get, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateNonConformite } from '../../../application/non-conformite/use-cases/CreateNonConformite';
import { GetNonConformite } from '../../../application/non-conformite/use-cases/GetNonConformite';
import { ListNonConformites } from '../../../application/non-conformite/use-cases/ListNonConformites';
import { ListNonConformitesBySpecimen } from '../../../application/non-conformite/use-cases/ListNonConformitesBySpecimen';
import { CreateNonConformiteDto } from '../../../application/non-conformite/dto/CreateNonConformiteDto';

@ApiTags('Non-Conformités')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('non-conformites')
export class NonConformiteController {
  constructor(
    private readonly createNonConformite: CreateNonConformite,
    private readonly getNonConformite: GetNonConformite,
    private readonly listNonConformites: ListNonConformites,
    private readonly listBySpecimen: ListNonConformitesBySpecimen,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.RECEPTION)
  @ApiOperation({ summary: 'List all non-conformités (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.listNonConformites.execute(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Record a non-conformité' })
  create(@Body() dto: CreateNonConformiteDto, @Request() req: { user?: { userId?: string } }) {
    return this.createNonConformite.execute(dto, req.user?.userId ?? null);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.PHYSICIAN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Get non-conformité by ID' })
  findOne(@Param('id') id: string) {
    return this.getNonConformite.execute(id);
  }

  @Get('by-specimen/:specimenId')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.PHYSICIAN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'List non-conformités for a specimen' })
  bySpecimen(@Param('specimenId') specimenId: string) {
    return this.listBySpecimen.execute(specimenId);
  }
}
