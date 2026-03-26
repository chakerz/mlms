import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useGetPricingTierQuery, useCreatePricingTierMutation, useUpdatePricingTierMutation } from '@/features/pricing/api/pricingApi'

interface FormState { name: string; description: string; defaultRate: string; notes: string; isActive: boolean }

const EMPTY: FormState = { name: '', description: '', defaultRate: '0', notes: '', isActive: true }

export function PricingTierFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id && id !== 'new')
  const { t } = useTranslation(['pricing', 'common'])
  const navigate = useNavigate()

  const { data: tier } = useGetPricingTierQuery(id!, { skip: !isEdit })
  const [create, { isLoading: creating }] = useCreatePricingTierMutation()
  const [update, { isLoading: updating }] = useUpdatePricingTierMutation()

  const [form, setForm] = useState<FormState>(EMPTY)

  useEffect(() => {
    if (tier) setForm({
      name: tier.name, description: tier.description ?? '', defaultRate: String(tier.defaultRate),
      notes: tier.notes ?? '', isActive: tier.isActive,
    })
  }, [tier])

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name: form.name, description: form.description || undefined,
      defaultRate: parseFloat(form.defaultRate) || 0, notes: form.notes || undefined, isActive: form.isActive }
    if (isEdit) await update({ id: id!, ...payload })
    else await create(payload)
    navigate('/pricing-tiers')
  }

  const isBusy = creating || updating

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <h1 className="text-xl font-semibold">{isEdit ? t('pricing:tier.titleEdit') : t('pricing:tier.titleCreate')}</h1>
      <Card>
        <CardHeader><CardTitle>{isEdit ? t('pricing:tier.titleEdit') : t('pricing:tier.titleCreate')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">{t('pricing:tier.name')} *</label>
              <Input value={form.name} onChange={set('name')} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">{t('pricing:tier.defaultRate')} (%)</label>
              <Input type="number" value={form.defaultRate} onChange={set('defaultRate')} step="any" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">{t('common:labels.description')}</label>
              <Input value={form.description} onChange={set('description')} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">{t('pricing:tier.notes')}</label>
              <Input value={form.notes} onChange={set('notes')} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              <label htmlFor="isActive" className="text-sm">{t('common:status.active')}</label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isBusy}>{t('common:actions.save')}</Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/pricing-tiers')}>{t('common:actions.cancel')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
