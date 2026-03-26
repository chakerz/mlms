import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR')
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetInventoryLinesQuery, SampleInventoryLineDto } from '@/features/sample/api/sampleApi'

type BadgeVariant = 'gray' | 'blue' | 'green' | 'orange' | 'red'

const statusVariant: Record<string, BadgeVariant> = {
  RECEIVED: 'blue', IN_STORAGE: 'green', IN_USE: 'orange', DISPOSED: 'gray', EXPIRED: 'red',
}

export function SampleInventoryListPage() {
  const { t } = useTranslation(['sample', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetInventoryLinesQuery({ page, pageSize })

  const columns: Column<SampleInventoryLineDto>[] = [
    { key: 'barcode', header: t('sample:inventory.barcode'), render: (_, l) => <span className="font-mono text-xs">{l.barcode}</span> },
    { key: 'inventoryCode', header: t('sample:inventory.inventoryCode'), render: (_, l) => <span className="text-sm font-medium">{l.inventoryCode}</span> },
    { key: 'currentLocation', header: t('sample:inventory.location'), render: (_, l) => <span className="text-sm">{l.currentLocation || '–'}</span> },
    { key: 'currentStatus', header: t('common:labels.status'), render: (_, l) => (
      <Badge variant={statusVariant[l.currentStatus] ?? 'gray'}>{t(`sample:inventory.status.${l.currentStatus}`, { defaultValue: l.currentStatus })}</Badge>
    )},
    { key: 'quantity', header: t('sample:inventory.quantity'), render: (_, l) => <span className="text-sm">{l.quantity} {l.unit || ''}</span> },
    { key: 'qcPassed', header: 'QC', render: (_, l) => (
      <Badge variant={l.qcPassed ? 'green' : 'orange'}>{l.qcPassed ? 'OK' : t('sample:inventory.qcPending')}</Badge>
    )},
    { key: 'expirationDate', header: t('sample:inventory.expirationDate'), render: (_, l) => (
      <span className="text-sm">{l.expirationDate ? fmt(l.expirationDate) : '–'}</span>
    )},
    { key: 'receptionDate', header: t('sample:inventory.receptionDate'), render: (_, l) => (
      <span className="text-sm text-muted-foreground">{fmt(l.receptionDate)}</span>
    )},
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('sample:inventory.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('sample:inventory.title')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(l) => l.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
