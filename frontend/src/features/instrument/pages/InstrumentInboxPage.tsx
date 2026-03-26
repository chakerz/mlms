import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/shadcn/button'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import {
  useGetInboxMessagesQuery,
  useReprocessInboxMessageMutation,
  InstrumentInboxDto,
} from '@/features/instrument/api/instrumentApi'

const fmt = (d: string) => new Date(d).toLocaleString('fr-FR')

const importVariant = (s: string) => {
  if (s === 'IMPORTED') return 'green'
  if (s === 'ERROR') return 'red'
  if (s === 'IGNORED') return 'gray'
  if (s === 'PARTIALLY_IMPORTED') return 'yellow'
  return 'blue'
}

const matchingVariant = (s: string) => {
  if (s === 'UNMATCHED') return 'gray'
  if (s === 'AMBIGUOUS') return 'yellow'
  if (s === 'FAILED') return 'red'
  return 'green'
}

export function InstrumentInboxPage() {
  const { t } = useTranslation(['instrument', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetInboxMessagesQuery({ page, pageSize })
  const [reprocess] = useReprocessInboxMessageMutation()

  const columns: Column<InstrumentInboxDto>[] = [
    { key: 'instrumentId', header: 'Instrument', render: (_, m) => <span className="font-mono text-xs">{m.instrumentId.slice(0, 8)}…</span> },
    { key: 'barcode', header: t('instrument:inbox.barcode'), render: (_, m) => <span className="font-mono text-xs">{m.barcode ?? '—'}</span> },
    { key: 'sampleId', header: t('instrument:inbox.sampleId'), render: (_, m) => <span className="font-mono text-xs">{m.sampleId ?? '—'}</span> },
    { key: 'matchingStatus', header: t('instrument:inbox.matchingStatus'), render: (_, m) => (
      <Badge variant={matchingVariant(m.matchingStatus)}>{t(`instrument:status.${m.matchingStatus}`, { defaultValue: m.matchingStatus })}</Badge>
    )},
    { key: 'importStatus', header: t('instrument:inbox.importStatus'), render: (_, m) => (
      <Badge variant={importVariant(m.importStatus)}>{t(`instrument:status.${m.importStatus}`, { defaultValue: m.importStatus })}</Badge>
    )},
    { key: 'receivedAt', header: t('instrument:inbox.receivedAt'), render: (_, m) => <span className="text-sm">{fmt(m.receivedAt)}</span> },
    { key: 'errorMessage', header: t('instrument:inbox.errorMessage'), render: (_, m) => (
      <span className="text-xs text-destructive truncate max-w-xs block">{m.errorMessage ?? '—'}</span>
    )},
    { key: 'actions', header: t('common:labels.actions'), render: (_, m) => (
      <Button size="sm" variant="outline" onClick={() => reprocess(m.id)}>{t('instrument:inbox.reprocess')}</Button>
    )},
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('instrument:inbox.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('instrument:inbox.title')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(m) => m.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
