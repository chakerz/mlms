import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetInvoicesQuery, InvoiceDto } from '@/features/invoice/api/invoiceApi'
import { formatDate } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  DRAFT: 'gray',
  PENDING: 'yellow',
  PAID: 'green',
  OVERDUE: 'red',
  CANCELLED: 'orange',
}

export function InvoiceListPage() {
  const { t } = useTranslation(['invoice', 'common'])
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetInvoicesQuery({ page, pageSize })

  const columns: Column<InvoiceDto>[] = [
    {
      key: 'invoiceNumber',
      header: t('invoice:form.invoiceNumber'),
      render: (_, inv) => (
        <span className="font-mono text-sm font-semibold text-primary">{inv.invoiceNumber}</span>
      ),
    },
    {
      key: 'customerName',
      header: t('invoice:form.customerName'),
      render: (_, inv) => (
        <span className="font-semibold text-secondary-foreground">{inv.customerName}</span>
      ),
    },
    {
      key: 'invoiceDate',
      header: t('invoice:form.invoiceDate'),
      render: (_, inv) => (
        <span className="text-sm text-muted-foreground">{formatDate(inv.invoiceDate)}</span>
      ),
    },
    {
      key: 'total',
      header: t('invoice:form.total'),
      render: (_, inv) => (
        <span className="text-sm font-semibold">{inv.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
      ),
    },
    {
      key: 'status',
      header: t('common:labels.status'),
      render: (_, inv) => (
        <Badge variant={STATUS_VARIANT[inv.status] ?? 'gray'}>
          {t(`invoice:status.${inv.status}`)}
        </Badge>
      ),
    },
    {
      key: 'balanceDue',
      header: t('invoice:form.balanceDue'),
      render: (_, inv) => (
        <span className={`text-sm font-semibold ${inv.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {inv.balanceDue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
        </span>
      ),
    },
    {
      key: 'actions',
      header: t('common:labels.actions'),
      render: (_, inv) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/invoices/${inv.id}`)
          }}
        >
          {t('common:actions.edit')}
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('invoice:title.list')}</h1>
        <Button onClick={() => navigate('/invoices/new')} disabled>
          <Plus className="size-4" />
          {t('invoice:actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('invoice:title.list')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(inv) => inv.id}
            loading={isLoading}
            onRowClick={(inv) => navigate(`/invoices/${inv.id}`)}
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
