import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { CurrentUser } from '../decorators/CurrentUser';
import { UserRole } from '../../../domain/common/types/UserRole';
import { GenerateReport } from '../../../application/report/use-cases/GenerateReport';
import { ValidateReport } from '../../../application/report/use-cases/ValidateReport';
import { SignReport } from '../../../application/report/use-cases/SignReport';
import { PublishReport } from '../../../application/report/use-cases/PublishReport';
import { GetReportById } from '../../../application/report/use-cases/GetReportById';
import { ListReports } from '../../../application/report/use-cases/ListReports';
import { GenerateReportDto } from '../../../application/report/dto/GenerateReportDto';
import { ValidateReportDto } from '../../../application/report/dto/ValidateReportDto';
import { SignReportDto } from '../../../application/report/dto/SignReportDto';
import { PublishReportDto } from '../../../application/report/dto/PublishReportDto';
import { JwtPayload } from '../../../infrastructure/security/jwt/JwtPayload';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('reports')
export class ReportController {
  constructor(
    private readonly generateReport: GenerateReport,
    private readonly validateReport: ValidateReport,
    private readonly signReport: SignReport,
    private readonly publishReport: PublishReport,
    private readonly getReportById: GetReportById,
    private readonly listReports: ListReports,
  ) {}

  @Post('generate')
  @HttpCode(201)
  @Roles(UserRole.PHYSICIAN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Generate a report from an order' })
  generate(@Body() dto: GenerateReportDto, @CurrentUser() user: JwtPayload) {
    return this.generateReport.execute(dto, user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'List reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'orderId', required: false, type: String })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('orderId') orderId?: string,
  ) {
    return this.listReports.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      status,
      orderId,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'Get report by ID with patient, order and results' })
  findOne(@Param('id') id: string) {
    return this.getReportById.execute(id);
  }

  @Post(':id/validate')
  @HttpCode(200)
  @Roles(UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'Validate a report (DRAFT → VALIDATED)' })
  validate(
    @Param('id') id: string,
    @Body() dto: ValidateReportDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.validateReport.execute(id, dto, user.sub);
  }

  @Post(':id/sign')
  @HttpCode(200)
  @Roles(UserRole.PHYSICIAN)
  @ApiOperation({ summary: 'Sign a report (VALIDATED → FINAL)' })
  sign(
    @Param('id') id: string,
    @Body() dto: SignReportDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.signReport.execute(id, dto, user.sub);
  }

  @Post(':id/publish')
  @HttpCode(200)
  @Roles(UserRole.PHYSICIAN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish a report (FINAL → PUBLISHED)' })
  publish(@Param('id') id: string, @Body() dto: PublishReportDto) {
    return this.publishReport.execute(id, dto);
  }
}
