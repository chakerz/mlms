import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, FlaskConical, Send } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { ConfirmDialog, Modal } from '@/shared/ui/Modal'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { useGetOrderQuery, useUpdateOrderStatusMutation, useCancelOrderMutation } from '@/features/order/api/orderApi'
import { useGetPatientQuery } from '@/features/patient/api/patientApi'
import { useGetInstrumentsQuery, useSendOrderToInstrumentMutation } from '@/features/instrument/api/instrumentApi'
import { formatDateTime, formatDate } from '@/shared/utils/formatDate'
import { SelectItem } from '@/shared/ui/Select'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/ui/shadcn/select'

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
  const analyzerDialog = useDisclosure()
  const [selectedInstrumentId, setSelectedInstrumentId] = useState('')
  const [sendFeedback, setSendFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const { data: order, isLoading, isError } = useGetOrderQuery(id!)
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation()
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
  const { data: instruments } = useGetInstrumentsQuery({ isActive: true, pageSize: 100 })
  const [sendOrderToInstrument, { isLoading: isSending }] = useSendOrderToInstrumentMutation()

  const handleSendToAnalyzer = async () => {
    if (!selectedInstrumentId || !id) return
    setSendFeedback(null)
    try {
      const result = await sendOrderToInstrument({ instrumentId: selectedInstrumentId, orderId: id }).unwrap()
      if (!result.sent) {
        setSendFeedback({ type: 'error', message: result.error || t('order:messages.sendFailed') })
      } else {
        setSendFeedback({
          type: 'success',
          message: `${t('order:messages.sentToAnalyzer')} (${result.resultCount} ${t('order:messages.results')})`,
        })
      }
      analyzerDialog.close()
    } catch {
      setSendFeedback({ type: 'error', message: t('order:messages.sendFailed') })
      analyzerDialog.close()
    }
  }

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
          <Button variant="secondary" size="sm" onClick={analyzerDialog.open}>
            <Send size={15} className="me-1" />
            {t('order:actions.sendToAnalyzer')}
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

      <Modal
        open={analyzerDialog.isOpen}
        onClose={analyzerDialog.close}
        title={t('order:actions.sendToAnalyzer')}
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={analyzerDialog.close}>
              {t('common:actions.cancel')}
            </Button>
            <Button size="sm" onClick={handleSendToAnalyzer} loading={isSending} disabled={!selectedInstrumentId}>
              <Send size={14} className="me-1" />
              {t('order:actions.send')}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-1">
          <p className="text-sm text-neutral-600">{t('order:messages.selectAnalyzer')}</p>
          <Select value={selectedInstrumentId} onValueChange={setSelectedInstrumentId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('order:form.selectInstrument')} />
            </SelectTrigger>
            <SelectContent>
              {instruments?.data.map((inst) => (
                <SelectItem key={inst.id} value={inst.id}>
                  {inst.code === 'SIM_CHEM_01' ? '🧪 ' : ''}{inst.name}
                  {inst.model ? ` (${inst.model})` : ''}
                  {' — '}{inst.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Modal>

      {sendFeedback && (
        <div className="fixed bottom-4 end-4 z-50">
          <Alert variant={sendFeedback.type === 'success' ? 'success' : 'error'} message={sendFeedback.message} />
        </div>
      )}
    </div>
  )
}
