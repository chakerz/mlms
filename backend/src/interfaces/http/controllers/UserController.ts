import { Controller, Get, Patch, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { Roles } from '../decorators/Roles';
import { CurrentUser } from '../decorators/CurrentUser';
import { UserRole } from '../../../domain/common/types/UserRole';
import { JwtPayload } from '../../../infrastructure/security/jwt/JwtPayload';
import { ListUsers } from '../../../application/user/use-cases/ListUsers';
import { GetUserById } from '../../../application/user/use-cases/GetUserById';
import { UpdateUser } from '../../../application/user/use-cases/UpdateUser';
import { UpdateUserDto } from '../../../application/user/dto/UpdateUserDto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesHttpGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UserController {
  constructor(
    private readonly listUsers: ListUsers,
    private readonly getUserById: GetUserById,
    private readonly updateUser: UpdateUser,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users (ADMIN only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  list(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.listUsers.execute({
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (ADMIN only)' })
  findOne(@Param('id') id: string) {
    return this.getUserById.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user role, language or active status (ADMIN only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.updateUser.execute(id, dto, currentUser.sub);
  }
}
