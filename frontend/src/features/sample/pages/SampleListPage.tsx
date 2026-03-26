import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetSamplesQuery, SampleDto } from '@/features/sample/api/sampleApi'

export function SampleListPage() {
  const { t } = useTranslation(['sample', 'common'])
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetSamplesQuery({ page, pageSize })

  const columns: Column<SampleDto>[] = [
    { key: 'sampleCode', header: t('sample:code'), render: (_, s) => <span className="font-mono text-xs font-semibold">{s.sampleCode}</span> },
    { key: 'name', header: t('common:labels.name'), render: (_, s) => <span className="font-semibold">{s.name}</span> },
    { key: 'sampleType', header: t('sample:type'), render: (_, s) => <span className="text-sm text-muted-foreground">{s.sampleType}</span> },
    { key: 'containerType', header: t('sample:container'), render: (_, s) => <span className="text-sm">{s.containerType || '–'}</span> },
    { key: 'storageConditions', header: t('sample:storage'), render: (_, s) => <span className="text-xs text-muted-foreground line-clamp-2">{s.storageConditions || '–'}</span> },
    { key: 'qcPassed', header: 'QC', render: (_, s) => (
      <Badge variant={s.qcPassed ? 'green' : 'red'}>{s.qcPassed ? 'OK' : 'NOK'}</Badge>
    )},
    { key: 'sampleStatus', header: t('common:labels.status'), render: (_, s) => (
      <Badge variant={s.sampleStatus === 'Active' ? 'green' : 'gray'}>{s.sampleStatus}</Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('sample:titleList')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('sample:titleList')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(s) => s.id} loading={isLoading} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
