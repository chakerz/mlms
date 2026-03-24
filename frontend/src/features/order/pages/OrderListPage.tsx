import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetOrdersQuery, OrderDto } from '@/features/order/api/orderApi'
import { useGetPatientQuery } from '@/features/patient/api/patientApi'
import { formatDate } from '@/shared/utils/formatDate'

function PatientCell({ patientId }: { patientId: string }) {
  const { data } = useGetPatientQuery(patientId)
  if (!data) return <span className="font-mono text-xs text-muted-foreground">{patientId.slice(-8)}</span>
  return (
    <span className="text-sm text-foreground">
      {data.lastName.toUpperCase()} {data.firstName}
      <span className="text-xs text-muted-foreground mx-2">·</span>
      <span className="text-xs text-muted-foreground">{formatDate(data.birthDate)}</span>
    </span>
  )
}

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  PENDING:   'yellow',
  COLLECTED: 'blue',
  ANALYZED:  'orange',
  VALIDATED: 'emerald',
  PUBLISHED: 'green',
  CANCELLED: 'red',
}

export function OrderListPage() {
  const { t } = useTranslation(['order', 'statuses', 'common'])
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetOrdersQuery({ page, pageSize })

  const columns: Column<OrderDto>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (_, o) => <span className="font-mono text-xs text-muted-foreground">{o.id.slice(-8)}</span>,
    },
    {
      key: 'patientId',
      header: t('order:form.patient'),
      render: (_, o) => <PatientCell patientId={o.patientId} />,
    },
    {
      key: 'status',
      header: t('common:labels.status'),
      render: (_, o) => (
        <Badge variant={STATUS_VARIANT[o.status] ?? 'gray'}>
          {t(`statuses:order.${o.status}`)}
        </Badge>
      ),
    },
    {
      key: 'priority',
      header: t('order:form.priority'),
      render: (_, o) => t(`order:priority.${o.priority}`),
    },
    {
      key: 'tests',
      header: t('order:form.tests'),
      render: (_, o) => (
        <span className="text-sm text-muted-foreground">{t('order:form.analysisCount', { count: o.tests.length })}</span>
      ),
    },
    {
      key: 'createdAt',
      header: t('common:labels.createdAt'),
      render: (_, o) => <span className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</span>,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('order:title')}</h1>
        <Button onClick={() => navigate('/orders/new')}>
          <Plus className="size-4" />
          {t('order:actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('order:title')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(o) => o.id}
            loading={isLoading}
            onRowClick={(o) => navigate(`/orders/${o.id}`)}
          />
        </CardTable>
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>
    </div>
  )
}
