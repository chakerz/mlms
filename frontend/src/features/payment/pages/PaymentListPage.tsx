import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetPaymentsQuery, PaymentDto } from '@/features/payment/api/paymentApi'
import { formatDate } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  PENDING: 'yellow',
  COMPLETED: 'green',
  FAILED: 'red',
  REFUNDED: 'orange',
}

export function PaymentListPage() {
  const { t } = useTranslation(['payment', 'common'])
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetPaymentsQuery({ page, pageSize })

  const columns: Column<PaymentDto>[] = [
    {
      key: 'referenceNumber',
      header: t('payment:form.referenceNumber'),
      render: (_, p) => (
        <span className="font-mono text-sm font-semibold text-primary">{p.referenceNumber}</span>
      ),
    },
    {
      key: 'patientName',
      header: t('payment:form.patientName'),
      render: (_, p) => (
        <span className="font-semibold text-secondary-foreground">{p.patientName ?? '–'}</span>
      ),
    },
    {
      key: 'totalAmount',
      header: t('payment:form.totalAmount'),
      render: (_, p) => (
        <span className="text-sm font-semibold">
          {p.totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
        </span>
      ),
    },
    {
      key: 'amountPaid',
      header: t('payment:form.amountPaid'),
      render: (_, p) => (
        <span className="text-sm font-semibold text-green-600">
          {p.amountPaid.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: t('payment:form.paymentMethod'),
      render: (_, p) => <span className="text-sm">{t(`payment:method.${p.paymentMethod}`)}</span>,
    },
    {
      key: 'status',
      header: t('common:labels.status'),
      render: (_, p) => (
        <Badge variant={STATUS_VARIANT[p.status] ?? 'gray'}>
          {t(`payment:status.${p.status}`)}
        </Badge>
      ),
    },
    {
      key: 'paymentDate',
      header: t('payment:form.paymentDate'),
      render: (_, p) => (
        <span className="text-xs text-muted-foreground">{formatDate(p.paymentDate)}</span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('payment:title.list')}</h1>
        <Button onClick={() => navigate('/payments/new')}>
          <Plus className="size-4" />
          {t('payment:actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('payment:title.list')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(p) => p.id}
            loading={isLoading}
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
