import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR')
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetQCResultsQuery, QCResultDto } from '@/features/qc/api/qcApi'

type BadgeVariant = 'gray' | 'blue' | 'green' | 'orange' | 'red'

const alertVariant: Record<string, BadgeVariant> = {
  GRAY: 'gray', GREEN: 'green', YELLOW: 'orange', RED: 'red',
}
const statusVariant: Record<string, BadgeVariant> = {
  PENDING: 'gray', ACCEPTED: 'green', REJECTED: 'red',
}

export function QCResultListPage() {
  const { t } = useTranslation(['qc', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetQCResultsQuery({ page, pageSize })

  const columns: Column<QCResultDto>[] = [
    { key: 'testName', header: t('qc:result.testName'), render: (_, r) => <span className="font-semibold">{r.testName}</span> },
    { key: 'resultValue', header: t('qc:result.resultValue'), render: (_, r) => <span className="text-sm">{r.resultValue || '–'}</span> },
    { key: 'alert', header: t('qc:result.alert'), render: (_, r) => (
      <Badge variant={alertVariant[r.alert] ?? 'gray'}>{r.alert}</Badge>
    )},
    { key: 'status', header: t('common:labels.status'), render: (_, r) => (
      <Badge variant={statusVariant[r.status] ?? 'gray'}>{t(`qc:result.status.${r.status}`, { defaultValue: r.status })}</Badge>
    )},
    { key: 'acceptableLimits', header: t('qc:result.acceptableLimits'), render: (_, r) => (
      <span className="text-xs text-muted-foreground">[{r.acceptableLimitLow} – {r.acceptableLimitHigh}]</span>
    )},
    { key: 'performedDate', header: t('qc:result.performedDate'), render: (_, r) => <span className="text-sm">{fmt(r.performedDate)}</span> },
    { key: 'performedBy', header: t('qc:result.performedBy'), render: (_, r) => <span className="text-sm text-muted-foreground">{r.performedBy || '–'}</span> },
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('qc:result.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('qc:result.title')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(r) => r.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
