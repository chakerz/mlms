import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/shared/ui/shadcn/input'
import { Button } from '@/shared/ui/shadcn/button'
import { Label } from '@/shared/ui/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select'
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
} from '@/shared/ui/shadcn/alert'
import { cn } from '@/shared/utils/cn'
import { RecordResultRequest, UpdateResultRequest, ResultDto } from '@/features/result/api/resultApi'

const FLAGS = ['N', 'H', 'L', 'HH', 'LL', 'CRITICAL'] as const

function suggestFlag(value: string, low: number | null, high: number | null): string | null {
  const v = parseFloat(value)
  if (isNaN(v) || (low === null && high === null)) return null
  if (high !== null && v > high * 1.5) return 'HH'
  if (low !== null && v < low * 0.5) return 'LL'
  if (high !== null && v > high) return 'H'
  if (low !== null && v < low) return 'L'
  return 'N'
}

interface TestOption {
  testCode: string
  testNameFr: string
  testNameAr: string
}

interface ResultFormProps {
  specimenId: string
  testOptions: TestOption[]
  existingResult?: ResultDto
  onSubmit: (data: RecordResultRequest | (UpdateResultRequest & { id: string })) => void
  onCancel?: () => void
  isLoading?: boolean
  error?: string
}

export function ResultForm({
  specimenId,
  testOptions,
  existingResult,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: ResultFormProps) {
  const { t } = useTranslation(['result', 'common'])
  const isEdit = !!existingResult

  const [testCode, setTestCode] = useState(existingResult?.testCode ?? '')
  const [value, setValue] = useState(existingResult?.value ?? '')
  const [unit, setUnit] = useState(existingResult?.unit ?? '')
  const [referenceLow, setReferenceLow] = useState(existingResult?.referenceLow?.toString() ?? '')
  const [referenceHigh, setReferenceHigh] = useState(existingResult?.referenceHigh?.toString() ?? '')
  const [flag, setFlag] = useState(existingResult?.flag ?? 'N')
  const [measuredAt, setMeasuredAt] = useState(
    existingResult
      ? existingResult.measuredAt.slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  )

  useEffect(() => {
    if (!isEdit) {
      const suggested = suggestFlag(
        value,
        referenceLow ? parseFloat(referenceLow) : null,
        referenceHigh ? parseFloat(referenceHigh) : null,
      )
      if (suggested) setFlag(suggested)
    }
  }, [value, referenceLow, referenceHigh, isEdit])

  const selectedTest = testOptions.find((opt) => opt.testCode === testCode)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && existingResult) {
      onSubmit({
        id: existingResult.id,
        value: value || undefined,
        unit: unit || null,
        referenceLow: referenceLow ? parseFloat(referenceLow) : null,
        referenceHigh: referenceHigh ? parseFloat(referenceHigh) : null,
        flag: flag || undefined,
        measuredAt: new Date(measuredAt).toISOString(),
      })
    } else {
      if (!testCode || !value || !flag) return
      onSubmit({
        specimenId,
        testCode,
        testNameFr: selectedTest?.testNameFr ?? testCode,
        testNameAr: selectedTest?.testNameAr ?? testCode,
        value,
        unit: unit || undefined,
        referenceLow: referenceLow ? parseFloat(referenceLow) : undefined,
        referenceHigh: referenceHigh ? parseFloat(referenceHigh) : undefined,
        flag,
        measuredAt: new Date(measuredAt).toISOString(),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" appearance="light" size="sm">
          <AlertIcon><AlertCircle /></AlertIcon>
          <AlertContent><AlertDescription>{error}</AlertDescription></AlertContent>
        </Alert>
      )}

      {!isEdit && (
        <div className="space-y-1.5">
          <Label>{t('result:fields.analysis')}</Label>
          <Select value={testCode} onValueChange={setTestCode}>
            <SelectTrigger>
              <SelectValue placeholder={t('common:actions.select')} />
            </SelectTrigger>
            <SelectContent>
              {testOptions.map((opt) => (
                <SelectItem key={opt.testCode} value={opt.testCode}>
                  {opt.testCode} – {opt.testNameFr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="result-value">{t('result:fields.value')}</Label>
          <Input
            id="result-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={!isEdit}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="result-unit">{t('result:fields.unit')}</Label>
          <Input
            id="result-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="g/dL"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="ref-low">{t('result:fields.referenceLow')}</Label>
          <Input
            id="ref-low"
            type="number"
            step="any"
            value={referenceLow}
            onChange={(e) => setReferenceLow(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ref-high">{t('result:fields.referenceHigh')}</Label>
          <Input
            id="ref-high"
            type="number"
            step="any"
            value={referenceHigh}
            onChange={(e) => setReferenceHigh(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t('result:fields.flag')}</Label>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFlag(f)}
              className={cn(
                'px-3 py-1 rounded-md border text-xs font-medium transition-colors',
                flag === f
                  ? f === 'CRITICAL'
                    ? 'bg-destructive border-destructive text-destructive-foreground'
                    : 'bg-primary border-primary text-primary-foreground'
                  : 'bg-background border-input text-foreground hover:bg-accent',
              )}
            >
              {t(`result:flags.${f}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="measured-at">{t('result:fields.measuredAt')}</Label>
        <Input
          id="measured-at"
          type="datetime-local"
          value={measuredAt}
          onChange={(e) => setMeasuredAt(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common:actions.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <svg className="animate-spin size-4 me-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {isEdit ? t('result:actions.save') : t('result:actions.record')}
        </Button>
      </div>
    </form>
  )
}
