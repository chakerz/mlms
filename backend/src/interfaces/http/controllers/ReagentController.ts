import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { CreateReagent } from '../../../application/reagent/use-cases/CreateReagent';
import { ListReagents } from '../../../application/reagent/use-cases/ListReagents';
import { ReceiveReagentLot } from '../../../application/reagent/use-cases/ReceiveReagentLot';
import { ListReagentLots } from '../../../application/reagent/use-cases/ListReagentLots';
import { ConsumeReagentForTest } from '../../../application/reagent/use-cases/ConsumeReagentForTest';
import { CreateReagentDto } from '../../../application/reagent/dto/CreateReagentDto';
import { ReceiveReagentLotDto } from '../../../application/reagent/dto/ReceiveReagentLotDto';
import { ConsumeReagentDto } from '../../../application/reagent/dto/ConsumeReagentDto';

@ApiTags('Reagents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Controller('reagents')
export class ReagentController {
  constructor(
    private readonly createReagent: CreateReagent,
    private readonly listReagents: ListReagents,
    private readonly receiveReagentLot: ReceiveReagentLot,
    private readonly listReagentLots: ListReagentLots,
    private readonly consumeReagentForTest: ConsumeReagentForTest,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new reagent' })
  create(@Body() dto: CreateReagentDto) {
    return this.createReagent.execute(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'List all reagents' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('category') category?: string,
  ) {
    return this.listReagents.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      category,
    });
  }

  @Post('lots')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Receive a new reagent lot' })
  receiveLot(@Body() dto: ReceiveReagentLotDto) {
    return this.receiveReagentLot.execute(dto);
  }

  @Get(':id/lots')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'List lots for a reagent' })
  lots(@Param('id') id: string) {
    return this.listReagentLots.execute(id);
  }

  @Post('consume')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Consume reagent for a test' })
  consume(@Body() dto: ConsumeReagentDto, @Request() req: { user?: { sub?: string } }) {
    return this.consumeReagentForTest.execute(dto, req.user?.sub);
  }
}
