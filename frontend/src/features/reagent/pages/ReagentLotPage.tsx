import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Alert } from '@/shared/ui/Alert'
import { Modal } from '@/shared/ui/Modal'
import { PageLoader } from '@/shared/ui/Loader'
import { useGetReagentLotsQuery, useReceiveLotMutation, useConsumeReagentMutation } from '../api/reagentApi'
import { ReagentLotTable } from '../components/ReagentLotTable'
import { StockAlertBanner } from '../components/StockAlertBanner'
import { ExpiryAlertBanner } from '../components/ExpiryAlertBanner'

export function ReagentLotPage() {
  const { id: reagentId } = useParams<{ id: string }>()
  const { t } = useTranslation(['reagent', 'common'])
  const navigate = useNavigate()

  const { data: lots = [], isLoading } = useGetReagentLotsQuery(reagentId!)
  const [receiveLot, { isLoading: isReceiving }] = useReceiveLotMutation()
  const [consumeReagent, { isLoading: isConsuming }] = useConsumeReagentMutation()

  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showConsumeModal, setShowConsumeModal] = useState(false)
  const [receiveError, setReceiveError] = useState<string | null>(null)
  const [consumeError, setConsumeError] = useState<string | null>(null)

  const [receiveForm, setReceiveForm] = useState({
    lotNumber: '',
    expiryDate: '',
    initialQuantity: '',
    storageLocation: '',
  })

  const [consumeForm, setConsumeForm] = useState({
    lotId: '',
    quantity: '',
    testCode: '',
  })

  const handleReceive = async (e: React.FormEvent) => {
    e.preventDefault()
    setReceiveError(null)
    try {
      await receiveLot({
        reagentId: reagentId!,
        lotNumber: receiveForm.lotNumber,
        expiryDate: receiveForm.expiryDate,
        initialQuantity: parseInt(receiveForm.initialQuantity, 10),
        storageLocation: receiveForm.storageLocation || undefined,
      }).unwrap()
      setShowReceiveModal(false)
      setReceiveForm({ lotNumber: '', expiryDate: '', initialQuantity: '', storageLocation: '' })
    } catch {
      setReceiveError(t('messages.lotReceiveError'))
    }
  }

  const handleConsume = async (e: React.FormEvent) => {
    e.preventDefault()
    setConsumeError(null)
    try {
      await consumeReagent({
        lotId: consumeForm.lotId,
        quantity: parseInt(consumeForm.quantity, 10),
        testCode: consumeForm.testCode,
      }).unwrap()
      setShowConsumeModal(false)
      setConsumeForm({ lotId: '', quantity: '', testCode: '' })
    } catch {
      setConsumeError(t('messages.consumeError'))
    }
  }

  return (
    <div>
      <CardHeader
        title={t('fields.lotNumber') + ' – ' + t('title')}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => setShowConsumeModal(true)} variant="secondary">
              {t('actions.consume')}
            </Button>
            <Button onClick={() => setShowReceiveModal(true)}>
              <Plus size={16} className="me-1" />
              {t('actions.receiveLot')}
            </Button>
          </div>
        }
      />

      <div className="mt-4">
        <StockAlertBanner lots={lots} />
        <ExpiryAlertBanner lots={lots} />
      </div>

      <Card className="mt-2">
        <div className="p-4">
          {isLoading ? (
            <PageLoader />
          ) : (
            <ReagentLotTable data={lots} />
          )}
        </div>
      </Card>

      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate('/reagents')}>
          {t('common:actions.back')}
        </Button>
      </div>

      {/* Receive Lot Modal */}
      <Modal
        open={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        title={t('modal.receiveLot')}
      >
        <form onSubmit={handleReceive} className="space-y-4">
          {receiveError && <Alert variant="error" message={receiveError} />}
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.lotNumber')} *</label>
            <Input
              value={receiveForm.lotNumber}
              onChange={(e) => setReceiveForm({ ...receiveForm, lotNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.expiryDate')} *</label>
            <Input
              type="date"
              value={receiveForm.expiryDate}
              onChange={(e) => setReceiveForm({ ...receiveForm, expiryDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.initialQuantity')} *</label>
            <Input
              type="number"
              min="1"
              value={receiveForm.initialQuantity}
              onChange={(e) => setReceiveForm({ ...receiveForm, initialQuantity: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.storageLocation')}</label>
            <Input
              value={receiveForm.storageLocation}
              onChange={(e) => setReceiveForm({ ...receiveForm, storageLocation: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isReceiving}>
              {isReceiving ? t('form.saving') : t('common:actions.save')}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowReceiveModal(false)}>
              {t('common:actions.cancel')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Consume Modal */}
      <Modal
        open={showConsumeModal}
        onClose={() => setShowConsumeModal(false)}
        title={t('modal.consume')}
      >
        <form onSubmit={handleConsume} className="space-y-4">
          {consumeError && <Alert variant="error" message={consumeError} />}
          <div>
            <label className="block text-sm font-medium mb-1">{t('form.lot')} *</label>
            <select
              value={consumeForm.lotId}
              onChange={(e) => setConsumeForm({ ...consumeForm, lotId: e.target.value })}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="">{t('form.selectLot')}</option>
              {lots
                .filter((l) => !l.isBlocked && !l.isExpired && l.currentQuantity > 0)
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.lotNumber} ({t('form.qty')}: {l.currentQuantity})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.quantity')} *</label>
            <Input
              type="number"
              min="1"
              value={consumeForm.quantity}
              onChange={(e) => setConsumeForm({ ...consumeForm, quantity: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('fields.testCode')} *</label>
            <Input
              value={consumeForm.testCode}
              onChange={(e) => setConsumeForm({ ...consumeForm, testCode: e.target.value })}
              placeholder="ex: HGB"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isConsuming}>
              {isConsuming ? t('form.consuming') : t('form.confirm')}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowConsumeModal(false)}>
              {t('common:actions.cancel')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
