import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateTestDefinition } from '../../../application/test-definition/use-cases/CreateTestDefinition';
import { UpdateTestDefinition } from '../../../application/test-definition/use-cases/UpdateTestDefinition';
import { ListTestDefinitions } from '../../../application/test-definition/use-cases/ListTestDefinitions';
import { GetTestDefinition } from '../../../application/test-definition/use-cases/GetTestDefinition';
import { CreateTestDefinitionDto } from '../../../application/test-definition/dto/CreateTestDefinitionDto';
import { UpdateTestDefinitionDto } from '../../../application/test-definition/dto/UpdateTestDefinitionDto';

@ApiTags('Test Definitions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('test-definitions')
export class TestDefinitionController {
  constructor(
    private readonly createTestDefinition: CreateTestDefinition,
    private readonly updateTestDefinition: UpdateTestDefinition,
    private readonly listTestDefinitions: ListTestDefinitions,
    private readonly getTestDefinition: GetTestDefinition,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a test definition' })
  create(@Body() dto: CreateTestDefinitionDto) {
    return this.createTestDefinition.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'List test definitions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.listTestDefinitions.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 50,
      category: category || undefined,
      search: search || undefined,
      activeOnly: activeOnly === 'true',
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.RECEPTION)
  @ApiOperation({ summary: 'Get test definition by ID' })
  getById(@Param('id') id: string) {
    return this.getTestDefinition.execute(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a test definition' })
  update(@Param('id') id: string, @Body() dto: UpdateTestDefinitionDto) {
    return this.updateTestDefinition.execute(id, dto);
  }
}
