import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { PageLoader } from '@/shared/ui/Loader'
import { useListAllSpecimensQuery, SpecimenDto } from '@/features/specimen/api/specimenApi'
import { formatDateTime } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  COLLECTED: 'yellow',
  RECEIVED:  'blue',
  PROCESSED: 'emerald',
  DISPOSED:  'gray',
  REJECTED:  'red',
}

export function SpecimensAllPage() {
  const { t } = useTranslation(['specimen', 'statuses', 'common'])
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useListAllSpecimensQuery({ page, pageSize })

  const columns: Column<SpecimenDto>[] = [
    {
      key: 'barcode',
      header: t('specimen:form.barcode'),
      render: (_, s) => (
        <span className="font-mono text-sm font-medium text-neutral-800">{s.barcode}</span>
      ),
    },
    {
      key: 'type',
      header: t('specimen:form.type'),
      render: (_, s) => t(`specimen:type.${s.type}`),
    },
    {
      key: 'status',
      header: t('common:labels.status'),
      render: (_, s) => (
        <Badge variant={STATUS_VARIANT[s.status] ?? 'gray'}>
          {t(`statuses:specimen.${s.status}`)}
        </Badge>
      ),
    },
    {
      key: 'collectionTime',
      header: t('specimen:form.collectionTime'),
      render: (_, s) => formatDateTime(s.collectionTime),
    },
  ]

  return (
    <div>
      <CardHeader title={t('specimen:title')} />
      <Card className="mt-4">
        <div className="p-4">
          {isLoading ? (
            <PageLoader />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={data?.data ?? []}
                keyExtractor={(s) => s.id}
                loading={isLoading}
                onRowClick={(s) => navigate(`/specimens/${s.id}`)}
              />
              <div className="mt-4">
                <TablePagination
                  page={page}
                  pageSize={pageSize}
                  total={data?.total ?? 0}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
