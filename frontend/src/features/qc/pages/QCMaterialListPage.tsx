import { useState } from 'react'
import { useTranslation } from 'react-i18next'
const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR')
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetQCMaterialsQuery, QCMaterialDto } from '@/features/qc/api/qcApi'

export function QCMaterialListPage() {
  const { t } = useTranslation(['qc', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetQCMaterialsQuery({ page, pageSize })

  const columns: Column<QCMaterialDto>[] = [
    { key: 'barcode', header: t('qc:material.barcode'), render: (_, m) => <span className="font-mono text-xs">{m.barcode}</span> },
    { key: 'name', header: t('qc:material.name'), render: (_, m) => <span className="font-semibold">{m.name}</span> },
    { key: 'lotNumber', header: t('qc:material.lotNumber'), render: (_, m) => <span className="text-sm">{m.lotNumber}</span> },
    { key: 'manufacturer', header: t('qc:material.manufacturer'), render: (_, m) => <span className="text-sm text-muted-foreground">{m.manufacturer}</span> },
    { key: 'expectedValue', header: t('qc:material.expectedValue'), render: (_, m) => <span className="text-sm">{m.expectedValue} ± {m.standardDeviation}</span> },
    { key: 'expirationDate', header: t('qc:material.expirationDate'), render: (_, m) => <span className="text-sm">{fmt(m.expirationDate)}</span> },
    { key: 'isActive', header: t('common:labels.status'), render: (_, m) => (
      <Badge variant={m.isActive ? 'green' : 'gray'}>{m.isActive ? t('common:status.active') : t('common:status.inactive')}</Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('qc:material.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('qc:material.title')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(m) => m.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
