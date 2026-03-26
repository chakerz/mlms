import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { DataTable, Column } from '@/shared/ui/Table'
import { useGetInvoiceQuery, InvoiceLineDto } from '@/features/invoice/api/invoiceApi'
import { useGetPaymentsQuery, PaymentDto } from '@/features/payment/api/paymentApi'
import { formatDate } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  DRAFT: 'gray',
  PENDING: 'yellow',
  PAID: 'green',
  OVERDUE: 'red',
  CANCELLED: 'orange',
}

const PAYMENT_STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  PENDING: 'yellow',
  COMPLETED: 'green',
  FAILED: 'red',
  REFUNDED: 'orange',
}

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['invoice', 'payment', 'common'])
  const navigate = useNavigate()

  const { data: invoice, isLoading } = useGetInvoiceQuery(id!)
  const { data: paymentsData } = useGetPaymentsQuery({ invoiceId: id, pageSize: 50 })

  if (isLoading) return <PageLoader />
  if (!invoice) return <Alert variant="error" message={t('invoice:messages.notFound')} />

  const lineColumns: Column<InvoiceLineDto>[] = [
    {
      key: 'itemDescription',
      header: t('invoice:lines.description'),
      render: (_, line) => <span className="text-sm">{line.itemDescription}</span>,
    },
    {
      key: 'quantity',
      header: t('invoice:lines.quantity'),
      render: (_, line) => <span className="text-sm text-center">{line.quantity}</span>,
    },
    {
      key: 'unitPrice',
      header: t('invoice:lines.unitPrice'),
      render: (_, line) => (
        <span className="text-sm">{line.unitPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
      ),
    },
    {
      key: 'taxRate',
      header: t('invoice:lines.taxRate'),
      render: (_, line) => <span className="text-sm">{line.taxRate}%</span>,
    },
    {
      key: 'lineTotal',
      header: t('invoice:lines.lineTotal'),
      render: (_, line) => (
        <span className="text-sm font-semibold">
          {line.lineTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
        </span>
      ),
    },
  ]

  const paymentColumns: Column<PaymentDto>[] = [
    {
      key: 'referenceNumber',
      header: t('payment:form.referenceNumber'),
      render: (_, p) => <span className="font-mono text-xs">{p.referenceNumber}</span>,
    },
    {
      key: 'paymentDate',
      header: t('payment:form.paymentDate'),
      render: (_, p) => <span className="text-sm text-muted-foreground">{formatDate(p.paymentDate)}</span>,
    },
    {
      key: 'amountPaid',
      header: t('payment:form.amountPaid'),
      render: (_, p) => (
        <span className="text-sm font-semibold">
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
        <Badge variant={PAYMENT_STATUS_VARIANT[p.status] ?? 'gray'}>
          {t(`payment:status.${p.status}`)}
        </Badge>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">
          {t('invoice:title.detail')} — {invoice.invoiceNumber}
        </h1>
        <Badge variant={STATUS_VARIANT[invoice.status] ?? 'gray'}>
          {t(`invoice:status.${invoice.status}`)}
        </Badge>
      </div>

      {/* Invoice Header Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('invoice:title.detail')}</CardTitle>
        </CardHeader>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{t('invoice:form.customerName')}</p>
            <p className="text-sm font-semibold">{invoice.customerName}</p>
          </div>
          {invoice.customerEmail && (
            <div>
              <p className="text-xs text-muted-foreground">{t('common:labels.email')}</p>
              <p className="text-sm">{invoice.customerEmail}</p>
            </div>
          )}
          {invoice.customerPhone && (
            <div>
              <p className="text-xs text-muted-foreground">{t('common:labels.phone')}</p>
              <p className="text-sm">{invoice.customerPhone}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">{t('invoice:form.invoiceDate')}</p>
            <p className="text-sm">{formatDate(invoice.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('invoice:form.dueDate')}</p>
            <p className="text-sm">{formatDate(invoice.dueDate)}</p>
          </div>
          {invoice.paymentTerms && (
            <div>
              <p className="text-xs text-muted-foreground">{t('invoice:form.paymentTerms')}</p>
              <p className="text-sm">{invoice.paymentTerms}</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border-t px-6 py-4 flex flex-col items-end gap-1">
          <div className="flex gap-8 text-sm">
            <span className="text-muted-foreground">{t('invoice:form.subtotal')}</span>
            <span>{invoice.subtotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
          </div>
          {invoice.totalDiscount > 0 && (
            <div className="flex gap-8 text-sm">
              <span className="text-muted-foreground">{t('invoice:form.totalDiscount')}</span>
              <span className="text-red-500">-{invoice.totalDiscount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
            </div>
          )}
          {invoice.totalTax > 0 && (
            <div className="flex gap-8 text-sm">
              <span className="text-muted-foreground">{t('invoice:form.totalTax')}</span>
              <span>{invoice.totalTax.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
            </div>
          )}
          <div className="flex gap-8 text-base font-bold border-t pt-2 mt-1">
            <span>{t('invoice:form.total')}</span>
            <span>{invoice.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
          </div>
          <div className="flex gap-8 text-sm">
            <span className="text-muted-foreground">{t('invoice:form.amountPaid')}</span>
            <span className="text-green-600">{invoice.amountPaid.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold">
            <span className="text-muted-foreground">{t('invoice:form.balanceDue')}</span>
            <span className={invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}>
              {invoice.balanceDue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
            </span>
          </div>
        </div>
      </Card>

      {/* Invoice Lines */}
      <Card>
        <CardHeader>
          <CardTitle>{t('invoice:lines.title')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={lineColumns}
            data={invoice.lines}
            keyExtractor={(l) => l.id}
            loading={false}
          />
        </CardTable>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader>
          <CardTitle>{t('invoice:payments.title')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={paymentColumns}
            data={paymentsData?.data ?? []}
            keyExtractor={(p) => p.id}
            loading={false}
          />
        </CardTable>
      </Card>
    </div>
  )
}
