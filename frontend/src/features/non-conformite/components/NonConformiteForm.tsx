import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Input } from '@/shared/ui/Input'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { Label } from '@/shared/ui/shadcn/label'
import {
  CreateNonConformiteRequest,
  NON_CONFORMITE_REASONS,
  CONFORMITE_ACTIONS,
} from '../api/nonConformiteApi'

interface NonConformiteFormProps {
  defaultSpecimenId?: string
  defaultOrderId?: string
  onSubmit: (data: CreateNonConformiteRequest) => void
  isLoading?: boolean
  error?: string
}

export function NonConformiteForm({
  defaultSpecimenId,
  defaultOrderId,
  onSubmit,
  isLoading,
  error,
}: NonConformiteFormProps) {
  const { t } = useTranslation('nonConformite')
  const [reason, setReason] = useState<string>(NON_CONFORMITE_REASONS[0])
  const [action, setAction] = useState<string>(CONFORMITE_ACTIONS[0])
  const [details, setDetails] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!defaultSpecimenId && !defaultOrderId) {
      setValidationError(t('validation.specimenOrOrderRequired'))
      return
    }

    onSubmit({
      specimenId: defaultSpecimenId,
      orderId: defaultOrderId,
      reason,
      action,
      details: details || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || validationError) && (
        <Alert variant="error" message={error ?? validationError ?? ''} />
      )}

      {defaultSpecimenId && (
        <div className="space-y-1.5">
          <Label>{t('form.specimenId')}</Label>
          <div className="px-3 py-2 bg-muted border border-border rounded-md text-sm font-mono text-muted-foreground">
            #{defaultSpecimenId.slice(-8)}
          </div>
        </div>
      )}

      <SelectField
        label={`${t('form.reason')} *`}
        value={reason}
        onValueChange={setReason}
      >
        {NON_CONFORMITE_REASONS.map((r) => (
          <SelectItem key={r} value={r}>{t(`reason.${r}`)}</SelectItem>
        ))}
      </SelectField>

      <SelectField
        label={`${t('form.action')} *`}
        value={action}
        onValueChange={setAction}
      >
        {CONFORMITE_ACTIONS.map((a) => (
          <SelectItem key={a} value={a}>{t(`action.${a}`)}</SelectItem>
        ))}
      </SelectField>

      <Input
        label={t('form.details')}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder={t('form.detailsPlaceholder')}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {t('actions.create')}
        </Button>
      </div>
    </form>
  )
}
