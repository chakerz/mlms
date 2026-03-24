import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Alert } from '@/shared/ui/Alert'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { Separator } from '@/shared/ui/shadcn/separator'
import { useCreateTestDefinitionMutation } from '../api/testDefinitionApi'

const CATEGORIES = [
  'BIOCHEMISTRY', 'HEMATOLOGY', 'HEMOSTASIS', 'SEROLOGY', 'IMMUNOLOGY',
  'MICROBIOLOGY', 'MOLECULAR_BIOLOGY', 'CYTOGENETICS', 'HORMONOLOGY',
  'ALLERGOLOGY', 'TUMOR_MARKERS',
]

export function TestDefinitionCreatePage() {
  const { t } = useTranslation('testDefinition')
  const navigate = useNavigate()
  const [create, { isLoading }] = useCreateTestDefinitionMutation()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    code: '',
    nameFr: '',
    nameAr: '',
    category: 'BIOCHEMISTRY',
    unit: '',
    referenceLow: '',
    referenceHigh: '',
    synonymes: '',
    sampleTypeFr: '',
    sampleTypeAr: '',
    tubeFr: '',
    tubeAr: '',
    method: '',
    collectionConditionFr: '',
    collectionConditionAr: '',
    preAnalyticDelay: '',
    turnaroundTime: '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const result = await create({
        code: form.code.toUpperCase(),
        nameFr: form.nameFr,
        nameAr: form.nameAr,
        category: form.category,
        unit: form.unit || undefined,
        referenceLow: form.referenceLow ? parseFloat(form.referenceLow) : undefined,
        referenceHigh: form.referenceHigh ? parseFloat(form.referenceHigh) : undefined,
        synonymes: form.synonymes || undefined,
        sampleTypeFr: form.sampleTypeFr || undefined,
        sampleTypeAr: form.sampleTypeAr || undefined,
        tubeFr: form.tubeFr || undefined,
        tubeAr: form.tubeAr || undefined,
        method: form.method || undefined,
        collectionConditionFr: form.collectionConditionFr || undefined,
        collectionConditionAr: form.collectionConditionAr || undefined,
        preAnalyticDelay: form.preAnalyticDelay || undefined,
        turnaroundTime: form.turnaroundTime || undefined,
      }).unwrap()
      navigate(`/test-definitions/${result.id}`)
    } catch {
      setError(t('messages.createError'))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/test-definitions')}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t('actions.create')}</h1>
      </div>

      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error" message={error} />}

            <Input
              label={`${t('fields.code')} *`}
              value={form.code}
              onChange={set('code')}
              placeholder="ex: GLU"
              required
            />
            <Input
              label={`${t('fields.nameFr')} *`}
              value={form.nameFr}
              onChange={set('nameFr')}
              required
            />
            <Input
              label={`${t('fields.nameAr')} *`}
              value={form.nameAr}
              onChange={set('nameAr')}
              dir="rtl"
              required
            />

            <SelectField
              label={`${t('fields.category')} *`}
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v })}
            >
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{t(`categories.${c}`)}</SelectItem>
              ))}
            </SelectField>

            <Input
              label={t('fields.unit')}
              value={form.unit}
              onChange={set('unit')}
              placeholder="ex: mmol/L"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input label={t('fields.referenceLow')} type="number" step="any" value={form.referenceLow} onChange={set('referenceLow')} />
              <Input label={t('fields.referenceHigh')} type="number" step="any" value={form.referenceHigh} onChange={set('referenceHigh')} />
            </div>

            <Separator />
            <p className="text-sm font-semibold text-foreground">{t('sections.catalogue')}</p>

            <Input label={t('fields.synonymes')} value={form.synonymes} onChange={set('synonymes')} />

            <div className="grid grid-cols-2 gap-4">
              <Input label={t('fields.sampleTypeFr')} value={form.sampleTypeFr} onChange={set('sampleTypeFr')} />
              <Input label={t('fields.sampleTypeAr')} value={form.sampleTypeAr} onChange={set('sampleTypeAr')} dir="rtl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label={t('fields.tubeFr')} value={form.tubeFr} onChange={set('tubeFr')} />
              <Input label={t('fields.tubeAr')} value={form.tubeAr} onChange={set('tubeAr')} dir="rtl" />
            </div>

            <Input label={t('fields.method')} value={form.method} onChange={set('method')} />

            <div className="grid grid-cols-2 gap-4">
              <Input label={t('fields.collectionConditionFr')} value={form.collectionConditionFr} onChange={set('collectionConditionFr')} />
              <Input label={t('fields.collectionConditionAr')} value={form.collectionConditionAr} onChange={set('collectionConditionAr')} dir="rtl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label={t('fields.preAnalyticDelay')} value={form.preAnalyticDelay} onChange={set('preAnalyticDelay')} />
              <Input label={t('fields.turnaroundTime')} value={form.turnaroundTime} onChange={set('turnaroundTime')} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={isLoading}>
                {t('actions.create', { ns: 'common' })}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/test-definitions')}>
                {t('actions.cancel', { ns: 'common' })}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
