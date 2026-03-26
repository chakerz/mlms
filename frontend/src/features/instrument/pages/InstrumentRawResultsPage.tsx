import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetRawResultsQuery, InstrumentRawResultDto } from '@/features/instrument/api/instrumentApi'

const fmt = (d: string | null) => d ? new Date(d).toLocaleString('fr-FR') : '—'

const statusVariant = (s: string) => {
  if (s === 'VALIDATED') return 'green'
  if (s === 'REJECTED_TECHNICALLY') return 'red'
  if (s === 'ACCEPTED_TECHNICALLY') return 'blue'
  if (s === 'FOR_VALIDATION') return 'yellow'
  return 'gray'
}

export function InstrumentRawResultsPage() {
  const { t } = useTranslation(['instrument', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetRawResultsQuery({ page, pageSize })

  const columns: Column<InstrumentRawResultDto>[] = [
    { key: 'instrumentId', header: 'Instrument', render: (_, m) => <span className="font-mono text-xs">{m.instrumentId.slice(0, 8)}…</span> },
    { key: 'instrumentTestCode', header: t('instrument:rawResults.instrumentTestCode'), render: (_, m) => <span className="font-mono text-xs">{m.instrumentTestCode}</span> },
    { key: 'internalTestCode', header: t('instrument:rawResults.internalTestCode'), render: (_, m) => <span className="font-mono text-xs">{m.internalTestCode ?? '—'}</span> },
    { key: 'resultValue', header: t('instrument:rawResults.resultValue'), render: (_, m) => (
      <span className="text-sm font-medium">{m.resultValue ?? m.resultText ?? '—'}</span>
    )},
    { key: 'unit', header: t('instrument:rawResults.unit'), render: (_, m) => <span className="text-sm">{m.unit ?? '—'}</span> },
    { key: 'flagCode', header: t('instrument:rawResults.flagCode'), render: (_, m) => (
      m.flagCode ? <Badge variant="yellow">{m.flagCode}</Badge> : <span className="text-muted-foreground">—</span>
    )},
    { key: 'resultStatus', header: t('instrument:rawResults.resultStatus'), render: (_, m) => (
      <Badge variant={statusVariant(m.resultStatus)}>{t(`instrument:status.${m.resultStatus}`, { defaultValue: m.resultStatus })}</Badge>
    )},
    { key: 'measuredAt', header: t('instrument:rawResults.measuredAt'), render: (_, m) => <span className="text-sm">{fmt(m.measuredAt)}</span> },
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('instrument:rawResults.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('instrument:rawResults.title')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(m) => m.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
