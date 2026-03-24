import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@/shared/ui/Alert'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { PatientSearchInput } from '@/features/patient/components/PatientSearchInput'
import { TestSelectionTable } from './TestSelectionTable'
import { CreateOrderRequest, CreateTestOrderItem } from '@/features/order/api/orderApi'

const PRESCRIPTOR_TYPES = ['GENERALISTE', 'SPECIALISTE', 'URGENTISTE', 'EXTERNE', 'AUTRE'] as const

interface OrderFormProps {
  onSubmit: (data: CreateOrderRequest) => void
  isLoading?: boolean
  error?: string
  defaultPatientId?: string
}

export function OrderForm({ onSubmit, isLoading, error, defaultPatientId }: OrderFormProps) {
  const { t } = useTranslation('order')
  const [patientId, setPatientId] = useState(defaultPatientId ?? '')
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE')
  const [prescriptorName, setPrescriptorName] = useState('')
  const [prescriptorType, setPrescriptorType] = useState('')
  const [tests, setTests] = useState<CreateTestOrderItem[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!patientId.trim()) {
      setValidationError(t('validation.patientRequired'))
      return
    }
    if (tests.length === 0) {
      setValidationError(t('validation.testsRequired'))
      return
    }

    onSubmit({
      patientId,
      priority,
      prescriptorName: prescriptorName || undefined,
      prescriptorType: prescriptorType || undefined,
      tests,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(error || validationError) && (
        <Alert variant="error" message={error ?? validationError ?? ''} />
      )}

      <PatientSearchInput
        value={patientId}
        onChange={setPatientId}
        disabled={!!defaultPatientId}
        error={validationError === t('validation.patientRequired') ? validationError : undefined}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('form.prescriptorName')}
          value={prescriptorName}
          onChange={(e) => setPrescriptorName(e.target.value)}
          placeholder={t('form.prescriptorNamePlaceholder')}
        />
        <SelectField
          label={t('form.prescriptorType')}
          value={prescriptorType}
          onValueChange={setPrescriptorType}
          placeholder="—"
        >
          {PRESCRIPTOR_TYPES.map((pt) => (
            <SelectItem key={pt} value={pt}>{t(`prescriptorType.${pt}`)}</SelectItem>
          ))}
        </SelectField>
      </div>

      <SelectField
        label={t('form.priority')}
        value={priority}
        onValueChange={(v) => setPriority(v as typeof priority)}
      >
        <SelectItem value="ROUTINE">{t('priority.ROUTINE')}</SelectItem>
        <SelectItem value="URGENT">{t('priority.URGENT')}</SelectItem>
        <SelectItem value="STAT">{t('priority.STAT')}</SelectItem>
      </SelectField>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium leading-none mb-2">
          {t('form.tests')}
          {tests.length > 0 && (
            <span className="text-xs font-normal text-primary">
              {tests.length} {t('form.selected')}
            </span>
          )}
        </label>
        <TestSelectionTable selected={tests} onChange={setTests} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {t('actions.create')}
        </Button>
      </div>
    </form>
  )
}
