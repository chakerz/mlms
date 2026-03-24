import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { CurrentUser } from '../decorators/CurrentUser';
import { UserRole } from '../../../domain/common/types/UserRole';
import { RecordResult } from '../../../application/result/use-cases/RecordResult';
import { UpdateResult } from '../../../application/result/use-cases/UpdateResult';
import { RecordResultDto } from '../../../application/result/dto/RecordResultDto';
import { UpdateResultDto } from '../../../application/result/dto/UpdateResultDto';
import { JwtPayload } from '../../../infrastructure/security/jwt/JwtPayload';

@ApiTags('Results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('results')
export class ResultController {
  constructor(
    private readonly recordResult: RecordResult,
    private readonly updateResult: UpdateResult,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Record a result for a specimen test' })
  create(@Body() dto: RecordResultDto, @CurrentUser() user: JwtPayload) {
    return this.recordResult.execute(dto, user.sub);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Update an existing result' })
  update(@Param('id') id: string, @Body() dto: UpdateResultDto) {
    return this.updateResult.execute(id, dto);
  }
}
