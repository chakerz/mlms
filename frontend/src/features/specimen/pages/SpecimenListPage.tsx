import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column } from '@/shared/ui/Table'
import { EmptyState } from '@/shared/ui/EmptyState'
import { useGetSpecimensByOrderQuery, SpecimenDto } from '@/features/specimen/api/specimenApi'
import { formatDateTime } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  COLLECTED: 'yellow',
  RECEIVED:  'blue',
  PROCESSED: 'emerald',
  DISPOSED:  'gray',
  REJECTED:  'red',
}

export function SpecimenListPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { t } = useTranslation(['specimen', 'statuses', 'common'])
  const navigate = useNavigate()
  const { data: specimens = [], isLoading } = useGetSpecimensByOrderQuery(orderId!)

  const columns: Column<SpecimenDto>[] = [
    {
      key: 'barcode',
      header: t('specimen:form.barcode'),
      render: (_, s) => (
        <span className="font-mono text-sm font-medium">{s.barcode}</span>
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
      render: (_, s) => <span className="text-xs text-muted-foreground">{formatDateTime(s.collectionTime)}</span>,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('specimen:title')}</h1>
        <Button onClick={() => navigate(`/orders/${orderId}/specimens/new`)}>
          <Plus className="size-4" />
          {t('specimen:actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('specimen:title')}</CardTitle>
        </CardHeader>
        <CardTable>
          {specimens.length === 0 && !isLoading ? (
            <EmptyState
              action={
                <Button onClick={() => navigate(`/orders/${orderId}/specimens/new`)}>
                  {t('specimen:actions.create')}
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={specimens}
              keyExtractor={(s) => s.id}
              loading={isLoading}
              onRowClick={(s) => navigate(`/specimens/${s.id}`)}
            />
          )}
        </CardTable>
      </Card>
    </div>
  )
}
