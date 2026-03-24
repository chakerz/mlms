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
import { RegisterPatient } from '../../../application/patient/use-cases/RegisterPatient';
import { GetPatientById } from '../../../application/patient/use-cases/GetPatientById';
import { ListPatients } from '../../../application/patient/use-cases/ListPatients';
import { UpdatePatient } from '../../../application/patient/use-cases/UpdatePatient';
import { RegisterPatientDto } from '../../../application/patient/dto/RegisterPatientDto';
import { UpdatePatientDto } from '../../../application/patient/dto/UpdatePatientDto';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientController {
  constructor(
    private readonly registerPatient: RegisterPatient,
    private readonly getPatientById: GetPatientById,
    private readonly listPatients: ListPatients,
    private readonly updatePatient: UpdatePatient,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new patient' })
  create(@Body() dto: RegisterPatientDto) {
    return this.registerPatient.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List or search patients' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'query', required: false, type: String })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('query') query?: string,
  ) {
    return this.listPatients.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      query,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  findOne(@Param('id') id: string) {
    return this.getPatientById.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient' })
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.updatePatient.execute(id, dto);
  }
}
