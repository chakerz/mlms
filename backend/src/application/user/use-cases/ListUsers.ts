import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { UserDto } from '../dto/UserDto';

interface ListUsersParams {
  page: number;
  pageSize: number;
}

export interface ListUsersResult {
  data: UserDto[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class ListUsers {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ page, pageSize }: ListUsersParams): Promise<ListUsersResult> {
    const { users, total } = await this.userRepository.list(page, pageSize);
    return {
      data: users.map(UserDto.from),
      total,
      page,
      pageSize,
    };
  }
}
