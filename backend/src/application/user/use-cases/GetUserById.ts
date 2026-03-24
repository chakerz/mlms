import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { UserDto } from '../dto/UserDto';

@Injectable()
export class GetUserById {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return UserDto.from(user);
  }
}
