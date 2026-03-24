import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { CurrentUser } from '../decorators/CurrentUser';
import { UserRole } from '../../../domain/common/types/UserRole';
import { GetPortalReports } from '../../../application/portal/use-cases/GetPortalReports';
import { GetPortalReportById } from '../../../application/portal/use-cases/GetPortalReportById';
import { GetPortalMe } from '../../../application/portal/use-cases/GetPortalMe';
import { JwtPayload } from '../../../infrastructure/security/jwt/JwtPayload';

@ApiTags('Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Roles(UserRole.PATIENT)
@Controller('portal')
export class PortalController {
  constructor(
    private readonly getPortalReports: GetPortalReports,
    private readonly getPortalReportById: GetPortalReportById,
    private readonly getPortalMe: GetPortalMe,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get patient profile from authenticated user' })
  me(@CurrentUser() user: JwtPayload) {
    return this.getPortalMe.execute(user.email);
  }

  @Get('reports')
  @ApiOperation({ summary: 'List published reports for the authenticated patient' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  listReports(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.getPortalReports.execute(
      user.email,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get a published report by ID for the authenticated patient' })
  getReport(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.getPortalReportById.execute(id, user.email);
  }
}
