import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/shadcn/button'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import {
  useGetOutboxMessagesQuery,
  useRetryOutboxMessageMutation,
  useCancelOutboxMessageMutation,
  InstrumentOutboxDto,
} from '@/features/instrument/api/instrumentApi'

const fmt = (d: string | null) => d ? new Date(d).toLocaleString('fr-FR') : '—'

const statusVariant = (s: string) => {
  if (s === 'ACK_RECEIVED') return 'green'
  if (s === 'FAILED') return 'red'
  if (s === 'CANCELLED') return 'gray'
  if (s === 'SENT') return 'blue'
  return 'yellow'
}

export function InstrumentOutboxPage() {
  const { t } = useTranslation(['instrument', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetOutboxMessagesQuery({ page, pageSize })
  const [retry] = useRetryOutboxMessageMutation()
  const [cancel] = useCancelOutboxMessageMutation()

  const columns: Column<InstrumentOutboxDto>[] = [
    { key: 'instrumentId', header: 'Instrument', render: (_, m) => <span className="font-mono text-xs">{m.instrumentId.slice(0, 8)}…</span> },
    { key: 'messageType', header: 'Type', render: (_, m) => <span className="text-sm">{m.messageType}</span> },
    { key: 'specimenId', header: t('instrument:outbox.specimenId'), render: (_, m) => <span className="font-mono text-xs">{m.specimenId ?? '—'}</span> },
    { key: 'status', header: t('instrument:outbox.status'), render: (_, m) => (
      <Badge variant={statusVariant(m.status)}>{t(`instrument:status.${m.status}`, { defaultValue: m.status })}</Badge>
    )},
    { key: 'retryCount', header: t('instrument:outbox.retryCount'), render: (_, m) => <span className="text-sm">{m.retryCount}</span> },
    { key: 'sentAt', header: t('instrument:outbox.sentAt'), render: (_, m) => <span className="text-sm">{fmt(m.sentAt)}</span> },
    { key: 'errorMessage', header: t('instrument:outbox.errorMessage'), render: (_, m) => (
      <span className="text-xs text-destructive truncate max-w-xs block">{m.errorMessage ?? '—'}</span>
    )},
    { key: 'actions', header: t('common:labels.actions'), render: (_, m) => (
      <div className="flex gap-1">
        {['FAILED', 'RETRY_SCHEDULED'].includes(m.status) && (
          <Button size="sm" variant="outline" onClick={() => retry(m.id)}>{t('instrument:outbox.retry')}</Button>
        )}
        {!['ACK_RECEIVED', 'CANCELLED'].includes(m.status) && (
          <Button size="sm" variant="destructive" onClick={() => cancel(m.id)}>{t('instrument:outbox.cancel')}</Button>
        )}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('instrument:outbox.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('instrument:outbox.title')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(m) => m.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
