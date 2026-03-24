import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface AuditLogParams {
  action: string;
  entityType: string;
  entityId: string;
  actorUserId?: string;
  afterJson?: object;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: AuditLogParams): Promise<void> {
    await this.prisma.auditEntry.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        actorUserId: params.actorUserId ?? null,
        afterJson: params.afterJson ?? undefined,
      },
    });
  }
}
