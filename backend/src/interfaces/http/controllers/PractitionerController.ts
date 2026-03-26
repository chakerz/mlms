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
import { CreatePractitioner } from '../../../application/practitioner/use-cases/CreatePractitioner';
import { GetPractitionerById } from '../../../application/practitioner/use-cases/GetPractitionerById';
import { ListPractitioners } from '../../../application/practitioner/use-cases/ListPractitioners';
import { UpdatePractitioner } from '../../../application/practitioner/use-cases/UpdatePractitioner';
import { CreatePractitionerDto } from '../../../application/practitioner/dto/CreatePractitionerDto';
import { UpdatePractitionerDto } from '../../../application/practitioner/dto/UpdatePractitionerDto';

@ApiTags('Practitioners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('practitioners')
export class PractitionerController {
  constructor(
    private readonly createPractitioner: CreatePractitioner,
    private readonly getPractitionerById: GetPractitionerById,
    private readonly listPractitioners: ListPractitioners,
    private readonly updatePractitioner: UpdatePractitioner,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new practitioner' })
  create(@Body() dto: CreatePractitionerDto) {
    return this.createPractitioner.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTION, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'List practitioners' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'speciality', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: String })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
    @Query('speciality') speciality?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.listPractitioners.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      search,
      speciality,
      isActive,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTION, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.BIOLOGISTE)
  @ApiOperation({ summary: 'Get practitioner by ID' })
  findOne(@Param('id') id: string) {
    return this.getPractitionerById.execute(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a practitioner' })
  update(@Param('id') id: string, @Body() dto: UpdatePractitionerDto) {
    return this.updatePractitioner.execute(id, dto);
  }
}
