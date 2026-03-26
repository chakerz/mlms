import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR')
const fmtDt = (d: string) => new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetQCSchedulesQuery, QCScheduleDto } from '@/features/qc/api/qcApi'

type BadgeVariant = 'gray' | 'blue' | 'green' | 'orange' | 'red'

const statusVariant: Record<string, BadgeVariant> = {
  PENDING: 'gray', IN_PROGRESS: 'blue', COMPLETED: 'green', CANCELLED: 'red',
}

export function QCScheduleListPage() {
  const { t } = useTranslation(['qc', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetQCSchedulesQuery({ page, pageSize })

  const columns: Column<QCScheduleDto>[] = [
    { key: 'barcode', header: t('qc:schedule.barcode'), render: (_, s) => <span className="font-mono text-xs">{s.barcode}</span> },
    { key: 'qcRuleName', header: t('qc:schedule.ruleName'), render: (_, s) => <span className="font-semibold">{s.qcRuleName}</span> },
    { key: 'scheduledDate', header: t('qc:schedule.scheduledDate'), render: (_, s) => <span className="text-sm">{fmtDt(s.scheduledDate)}</span> },
    { key: 'duration', header: t('qc:schedule.duration'), render: (_, s) => <span className="text-sm">{s.duration} min</span> },
    { key: 'status', header: t('common:labels.status'), render: (_, s) => (
      <Badge variant={statusVariant[s.status] ?? 'gray'}>{t(`qc:schedule.status.${s.status}`, { defaultValue: s.status })}</Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('qc:schedule.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('qc:schedule.title')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(s) => s.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
