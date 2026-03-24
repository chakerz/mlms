import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, FlaskConical } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { ConfirmDialog } from '@/shared/ui/Modal'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { useGetOrderQuery, useUpdateOrderStatusMutation, useCancelOrderMutation } from '@/features/order/api/orderApi'
import { useGetPatientQuery } from '@/features/patient/api/patientApi'
import { formatDateTime, formatDate } from '@/shared/utils/formatDate'

function PatientName({ patientId }: { patientId: string }) {
  const { data } = useGetPatientQuery(patientId)
  if (!data) return <span className="text-sm font-mono text-neutral-400">{patientId.slice(-8)}</span>
  return (
    <span className="text-sm text-neutral-800">
      {data.lastName.toUpperCase()} {data.firstName}
      <span className="text-neutral-400 ms-2">{formatDate(data.birthDate)}</span>
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

const NEXT_STATUS: Partial<Record<string, string>> = {
  PENDING:   'COLLECTED',
  COLLECTED: 'ANALYZED',
  ANALYZED:  'VALIDATED',
  VALIDATED: 'PUBLISHED',
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['order', 'statuses', 'common'])
  const navigate = useNavigate()
  const cancelDialog = useDisclosure()
  const { data: order, isLoading, isError } = useGetOrderQuery(id!)
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()

  if (isLoading) return <PageLoader />
  if (isError || !order) return <Alert variant="error" message={t('order:messages.notFound')} />

  const nextStatus = NEXT_STATUS[order.status]
  const canCancel = ['PENDING', 'COLLECTED', 'ANALYZED'].includes(order.status)

  const handleAdvance = async () => {
    if (!nextStatus) return
    await updateStatus({ id: id!, status: nextStatus })
  }

  const handleCancel = async () => {
    await cancelOrder(id!)
    cancelDialog.close()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900">{t('order:detailTitle')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/orders/${id}/specimens`)}>
            <FlaskConical size={15} className="me-1" />
            {t('common:navigation.specimens')}
          </Button>
          {canCancel && (
            <Button variant="secondary" size="sm" onClick={cancelDialog.open}>
              {t('order:actions.cancel')}
            </Button>
          )}
          {nextStatus && (
            <Button size="sm" onClick={handleAdvance} loading={isUpdating}>
              → {t(`statuses:order.${nextStatus}`)}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="p-6">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase">{t('common:labels.status')}</dt>
                <dd className="mt-1">
                  <Badge variant={STATUS_VARIANT[order.status] ?? 'gray'}>
                    {t(`statuses:order.${order.status}`)}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase">{t('order:form.priority')}</dt>
                <dd className="mt-1 text-sm text-neutral-800">{t(`order:priority.${order.priority}`)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase">{t('order:form.patient')}</dt>
                <dd className="mt-1">
                  <PatientName patientId={order.patientId} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase">{t('common:labels.createdAt')}</dt>
                <dd className="mt-1 text-sm text-neutral-800">{formatDateTime(order.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-neutral-100">
            <h3 className="text-sm font-semibold text-neutral-700">
              {t('order:form.tests')} ({order.tests.length})
            </h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {order.tests.map((test) => (
              <div key={test.id} className="flex items-center gap-4 px-6 py-3">
                <span className="text-sm font-mono font-medium text-neutral-700 w-16">{test.testCode}</span>
                <span className="text-sm text-neutral-600">{test.testNameFr}</span>
                <span className="text-xs text-neutral-400 ms-auto">{t(`order:priority.${test.priority}`)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={cancelDialog.isOpen}
        onClose={cancelDialog.close}
        onConfirm={handleCancel}
        title={t('order:actions.cancel')}
        message={t('order:messages.cancelConfirm')}
        isLoading={isCancelling}
      />
    </div>
  )
}
