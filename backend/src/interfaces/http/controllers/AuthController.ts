import {
  Controller,
  Post,
  Patch,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Login } from '../../../application/auth/use-cases/Login';
import { RegisterUser } from '../../../application/auth/use-cases/RegisterUser';
import { GetCurrentUser as GetCurrentUserUseCase } from '../../../application/auth/use-cases/GetCurrentUser';
import { ChangeUserLanguage } from '../../../application/auth/use-cases/ChangeUserLanguage';
import { LoginDto } from '../../../application/auth/dto/LoginDto';
import { RegisterUserDto } from '../../../application/auth/dto/RegisterUserDto';
import { ChangeLanguageDto } from '../../../application/auth/dto/ChangeLanguageDto';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RolesHttpGuard } from '../guards/RolesHttpGuard';
import { CurrentUser } from '../decorators/CurrentUser';
import { Roles } from '../decorators/Roles';
import { UserRole } from '../../../domain/common/types/UserRole';
import { JwtPayload } from '../../../infrastructure/security/jwt/JwtPayload';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: Login,
    private readonly registerUser: RegisterUser,
    private readonly getCurrentUser: GetCurrentUserUseCase,
    private readonly changeUserLanguage: ChangeUserLanguage,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate and receive JWT' })
  loginAction(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesHttpGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user (ADMIN only)' })
  register(@Body() dto: RegisterUserDto) {
    return this.registerUser.execute(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: JwtPayload) {
    return this.getCurrentUser.execute(user.sub);
  }

  @Patch('me/language')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change language preference for current user' })
  changeLanguage(@Body() dto: ChangeLanguageDto, @CurrentUser() user: JwtPayload) {
    return this.changeUserLanguage.execute(user.sub, dto.language);
  }
}
