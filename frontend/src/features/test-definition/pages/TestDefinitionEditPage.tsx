import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Label } from '@/shared/ui/shadcn/label'
import { Separator } from '@/shared/ui/shadcn/separator'
import { useGetTestDefinitionByIdQuery, useUpdateTestDefinitionMutation } from '../api/testDefinitionApi'

const CATEGORIES = [
  'BIOCHEMISTRY', 'HEMATOLOGY', 'HEMOSTASIS', 'SEROLOGY', 'IMMUNOLOGY',
  'MICROBIOLOGY', 'MOLECULAR_BIOLOGY', 'CYTOGENETICS', 'HORMONOLOGY',
  'ALLERGOLOGY', 'TUMOR_MARKERS',
]

export function TestDefinitionEditPage() {
  const { t } = useTranslation('testDefinition')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: def, isLoading: isFetching } = useGetTestDefinitionByIdQuery(id!)
  const [update, { isLoading }] = useUpdateTestDefinitionMutation()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    nameFr: '',
    nameAr: '',
    category: '',
    unit: '',
    referenceLow: '',
    referenceHigh: '',
    isActive: true,
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

  useEffect(() => {
    if (def) {
      setForm({
        nameFr: def.nameFr,
        nameAr: def.nameAr,
        category: def.category,
        unit: def.unit ?? '',
        referenceLow: def.referenceLow != null ? String(def.referenceLow) : '',
        referenceHigh: def.referenceHigh != null ? String(def.referenceHigh) : '',
        isActive: def.isActive,
        synonymes: def.synonymes ?? '',
        sampleTypeFr: def.sampleTypeFr ?? '',
        sampleTypeAr: def.sampleTypeAr ?? '',
        tubeFr: def.tubeFr ?? '',
        tubeAr: def.tubeAr ?? '',
        method: def.method ?? '',
        collectionConditionFr: def.collectionConditionFr ?? '',
        collectionConditionAr: def.collectionConditionAr ?? '',
        preAnalyticDelay: def.preAnalyticDelay ?? '',
        turnaroundTime: def.turnaroundTime ?? '',
      })
    }
  }, [def])

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await update({
        id: id!,
        nameFr: form.nameFr,
        nameAr: form.nameAr,
        category: form.category,
        unit: form.unit || null,
        referenceLow: form.referenceLow ? parseFloat(form.referenceLow) : null,
        referenceHigh: form.referenceHigh ? parseFloat(form.referenceHigh) : null,
        isActive: form.isActive,
        synonymes: form.synonymes || null,
        sampleTypeFr: form.sampleTypeFr || null,
        sampleTypeAr: form.sampleTypeAr || null,
        tubeFr: form.tubeFr || null,
        tubeAr: form.tubeAr || null,
        method: form.method || null,
        collectionConditionFr: form.collectionConditionFr || null,
        collectionConditionAr: form.collectionConditionAr || null,
        preAnalyticDelay: form.preAnalyticDelay || null,
        turnaroundTime: form.turnaroundTime || null,
      }).unwrap()
      navigate(`/test-definitions/${id}`)
    } catch {
      setError(t('messages.updateError'))
    }
  }

  if (isFetching) return <PageLoader />

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/test-definitions/${id}`)}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">
          {t('actions.edit')} — <span className="font-mono text-muted-foreground">{def?.code ?? ''}</span>
        </h1>
      </div>

      <Card className="max-w-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error" message={error} />}

            <Input label={t('fields.code')} value={def?.code ?? ''} disabled />

            <Input label={`${t('fields.nameFr')} *`} value={form.nameFr} onChange={set('nameFr')} required />
            <Input label={`${t('fields.nameAr')} *`} value={form.nameAr} onChange={set('nameAr')} dir="rtl" required />

            <SelectField
              label={`${t('fields.category')} *`}
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v })}
            >
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{t(`categories.${c}`)}</SelectItem>
              ))}
            </SelectField>

            <Input label={t('fields.unit')} value={form.unit} onChange={set('unit')} placeholder="ex: mmol/L" />

            <div className="grid grid-cols-2 gap-4">
              <Input label={t('fields.referenceLow')} type="number" step="any" value={form.referenceLow} onChange={set('referenceLow')} />
              <Input label={t('fields.referenceHigh')} type="number" step="any" value={form.referenceHigh} onChange={set('referenceHigh')} />
            </div>

            <div className="flex items-center gap-2.5">
              <Checkbox
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: !!checked })}
              />
              <Label htmlFor="isActive">{t('fields.isActive')}</Label>
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
                {t('actions.save', { ns: 'common' })}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`/test-definitions/${id}`)}>
                {t('actions.cancel', { ns: 'common' })}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
