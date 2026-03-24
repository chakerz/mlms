// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface AuditEntryDto {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson: Record<string, unknown> | null;
  afterJson: Record<string, unknown> | null;
  createdAt: string;
}
