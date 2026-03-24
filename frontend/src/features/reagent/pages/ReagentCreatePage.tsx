import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Alert } from '@/shared/ui/Alert'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { useCreateReagentMutation } from '../api/reagentApi'

const CATEGORIES = ['CHEMISTRY', 'HEMATOLOGY', 'IMMUNOLOGY', 'MICROBIOLOGY']

export function ReagentCreatePage() {
  const { t } = useTranslation('reagent')
  const navigate = useNavigate()
  const [createReagent, { isLoading }] = useCreateReagentMutation()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    manufacturer: '',
    catalogNumber: '',
    category: 'CHEMISTRY',
    storageTemp: '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createReagent({
        name: form.name,
        manufacturer: form.manufacturer,
        catalogNumber: form.catalogNumber || undefined,
        category: form.category,
        storageTemp: form.storageTemp || undefined,
      }).unwrap()
      navigate('/reagents')
    } catch {
      setError(t('messages.createError', { defaultValue: 'Erreur lors de la création du réactif.' }))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/reagents')}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t('actions.create')}</h1>
      </div>

      <Card className="max-w-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert variant="error" message={error} />}

            <Input label={`${t('fields.name')} *`} value={form.name} onChange={set('name')} required />
            <Input label={`${t('fields.manufacturer')} *`} value={form.manufacturer} onChange={set('manufacturer')} required />

            <SelectField
              label={`${t('fields.category')} *`}
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v })}
            >
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectField>

            <Input label={t('fields.catalogNumber')} value={form.catalogNumber} onChange={set('catalogNumber')} />
            <Input label={t('fields.storageTemp')} value={form.storageTemp} onChange={set('storageTemp')} placeholder="ex: 2–8 °C" />

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={isLoading}>
                {t('actions.create')}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/reagents')}>
                {t('actions.cancel', { ns: 'common', defaultValue: 'Annuler' })}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
