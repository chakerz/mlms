import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';
import { UserRole } from '../../../domain/common/types/UserRole';
import { Language } from '../../../domain/common/types/Language';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async save(user: User): Promise<User> {
    // Cast enum values to string to bridge domain ↔ Prisma type mismatch
    const data = {
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role as unknown as import('@prisma/client').UserRole,
      language: user.language as unknown as import('@prisma/client').Language,
      isActive: user.isActive,
    };
    const row = user.id
      ? await this.prisma.user.upsert({
          where: { id: user.id },
          create: data,
          update: data,
        })
      : await this.prisma.user.create({ data });
    return this.toDomain(row);
  }

  async list(page: number, pageSize: number): Promise<{ users: User[]; total: number }> {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string;
    email: string;
    passwordHash: string;
    role: string;
    language: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      row.id,
      row.email,
      row.passwordHash,
      row.role as UserRole,
      row.language as Language,
      row.isActive,
      row.createdAt,
      row.updatedAt,
    );
  }
}
