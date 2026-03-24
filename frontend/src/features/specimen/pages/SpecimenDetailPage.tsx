import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { BarcodePreview } from '@/features/specimen/components/BarcodePreview'
import { BarcodePrintButton } from '@/features/specimen/components/BarcodePrintButton'
import {
  useGetSpecimenQuery,
  useUpdateSpecimenStatusMutation,
} from '@/features/specimen/api/specimenApi'
import { formatDateTime } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  COLLECTED: 'yellow',
  RECEIVED:  'blue',
  PROCESSED: 'emerald',
  DISPOSED:  'gray',
  REJECTED:  'red',
}

const NEXT_STATUS: Partial<Record<string, string>> = {
  COLLECTED: 'RECEIVED',
  RECEIVED:  'PROCESSED',
  PROCESSED: 'DISPOSED',
}

const CAN_REJECT = ['COLLECTED', 'RECEIVED']

export function SpecimenDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['specimen', 'statuses', 'common'])
  const navigate = useNavigate()
  const { data: specimen, isLoading, isError } = useGetSpecimenQuery(id!)
  const [updateStatus, { isLoading: isUpdating }] = useUpdateSpecimenStatusMutation()

  if (isLoading) return <PageLoader />
  if (isError || !specimen) return <Alert variant="error" message={t('specimen:messages.notFound')} />

  const nextStatus = NEXT_STATUS[specimen.status]
  const canReject = CAN_REJECT.includes(specimen.status)

  const advance = async () => {
    if (!nextStatus) return
    await updateStatus({
      id: id!,
      status: nextStatus,
      receivedAt: nextStatus === 'RECEIVED' ? new Date().toISOString() : undefined,
    })
  }

  const reject = async () => {
    await updateStatus({ id: id!, status: 'REJECTED' })
  }

  const fields = [
    { label: t('specimen:form.type'),           value: t(`specimen:type.${specimen.type}`) },
    { label: t('specimen:form.collectionTime'), value: formatDateTime(specimen.collectionTime) },
    { label: t('specimen:form.notes'),          value: specimen.notes ?? '–' },
    {
      label: t('specimen:form.receivedAt'),
      value: specimen.receivedAt ? formatDateTime(specimen.receivedAt) : '–',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/orders/${specimen.orderId}/specimens`)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900">{t('specimen:detailTitle')}</h1>
        </div>
        <div className="flex gap-2">
          {canReject && (
            <Button variant="secondary" size="sm" onClick={reject} loading={isUpdating}>
              {t('specimen:actions.reject')}
            </Button>
          )}
          {nextStatus && (
            <Button size="sm" onClick={advance} loading={isUpdating}>
              → {t(`statuses:specimen.${nextStatus}`)}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Barcode card */}
        <Card>
          <div className="p-6 flex flex-col items-center gap-4">
            <BarcodePreview barcode={specimen.barcode} />
            <BarcodePrintButton barcode={specimen.barcode} />
          </div>
        </Card>

        {/* Detail card */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={STATUS_VARIANT[specimen.status] ?? 'gray'}>
                {t(`statuses:specimen.${specimen.status}`)}
              </Badge>
              <span className="text-xs text-neutral-400">
                {t('specimen:form.orderRef')} : <span className="font-mono">{specimen.orderId.slice(-10)}</span>
              </span>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {fields.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs font-medium text-neutral-400 uppercase">{f.label}</dt>
                  <dd className="mt-1 text-sm text-neutral-800">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      </div>
    </div>
  )
}
