import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, USER_REPOSITORY } from './persistence.module';
import { IUserRepository } from '../domain/user/repositories/IUserRepository';
import { ListUsers } from '../application/user/use-cases/ListUsers';
import { GetUserById } from '../application/user/use-cases/GetUserById';
import { UpdateUser } from '../application/user/use-cases/UpdateUser';
import { UserController } from '../interfaces/http/controllers/UserController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: ListUsers,
      useFactory: (repo: IUserRepository) => new ListUsers(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: GetUserById,
      useFactory: (repo: IUserRepository) => new GetUserById(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateUser,
      useFactory: (repo: IUserRepository) => new UpdateUser(repo),
      inject: [USER_REPOSITORY],
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
