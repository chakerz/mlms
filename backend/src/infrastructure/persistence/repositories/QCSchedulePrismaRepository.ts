import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IQCScheduleRepository, ListQCSchedulesQuery } from '../../../domain/qc/repositories/IQCScheduleRepository';
import { QCSchedule } from '../../../domain/qc/entities/QCSchedule';

@Injectable()
export class QCSchedulePrismaRepository implements IQCScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QCSchedule | null> {
    const row = await this.prisma.qCSchedule.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(schedule: QCSchedule): Promise<QCSchedule> {
    const row = await this.prisma.qCSchedule.create({
      data: {
        barcode: schedule.barcode,
        qcRuleName: schedule.qcRuleName,
        scheduledDate: schedule.scheduledDate,
        duration: schedule.duration,
        status: schedule.status as never,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<QCSchedule>): Promise<QCSchedule> {
    const row = await this.prisma.qCSchedule.update({ where: { id }, data: data as never });
    return this.toDomain(row);
  }

  async list(query: ListQCSchedulesQuery): Promise<{ schedules: QCSchedule[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.status) where['status'] = query.status;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.qCSchedule.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { scheduledDate: 'desc' },
      }),
      this.prisma.qCSchedule.count({ where }),
    ]);
    return { schedules: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string; barcode: string; qcRuleName: string; scheduledDate: Date;
    duration: number; status: string; createdAt: Date; updatedAt: Date;
  }): QCSchedule {
    return new QCSchedule(row.id, row.barcode, row.qcRuleName, row.scheduledDate,
      row.duration, row.status, row.createdAt, row.updatedAt);
  }
}
