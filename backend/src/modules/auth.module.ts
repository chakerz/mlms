import { Module } from '@nestjs/common';
import { SharedModule, PASSWORD_HASHER, TOKEN_SERVICE } from './shared.module';
import { PersistenceModule, USER_REPOSITORY } from './persistence.module';
import { Login } from '../application/auth/use-cases/Login';
import { RegisterUser } from '../application/auth/use-cases/RegisterUser';
import { GetCurrentUser } from '../application/auth/use-cases/GetCurrentUser';
import { ChangeUserLanguage } from '../application/auth/use-cases/ChangeUserLanguage';
import { AuthController } from '../interfaces/http/controllers/AuthController';
import { RolesHttpGuard } from '../interfaces/http/guards/RolesHttpGuard';
import { IUserRepository } from '../domain/user/repositories/IUserRepository';
import { IPasswordHasher } from '../application/common/interfaces/IPasswordHasher';
import { ITokenService } from '../application/common/interfaces/ITokenService';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: Login,
      useFactory: (
        userRepo: IUserRepository,
        hasher: IPasswordHasher,
        tokenService: ITokenService,
      ) => new Login(userRepo, hasher, tokenService),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
    {
      provide: RegisterUser,
      useFactory: (userRepo: IUserRepository, hasher: IPasswordHasher) =>
        new RegisterUser(userRepo, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: GetCurrentUser,
      useFactory: (userRepo: IUserRepository) => new GetCurrentUser(userRepo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ChangeUserLanguage,
      useFactory: (userRepo: IUserRepository) => new ChangeUserLanguage(userRepo),
      inject: [USER_REPOSITORY],
    },
    RolesHttpGuard,
  ],
  controllers: [AuthController],
  exports: [Login, RegisterUser, GetCurrentUser, ChangeUserLanguage],
})
export class AuthModule {}
