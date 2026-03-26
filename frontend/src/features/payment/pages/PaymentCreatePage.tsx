import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Input } from '@/shared/ui/Input'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { useCreatePaymentMutation } from '@/features/payment/api/paymentApi'

const PAYMENT_METHODS = ['CASH', 'CARD', 'CHECK', 'BANK_TRANSFER', 'INSURANCE'] as const

const schema = z.object({
  invoiceId: z.string().optional(),
  patientId: z.string().optional(),
  patientName: z.string().optional(),
  totalAmount: z.coerce.number().min(0),
  amountPaid: z.coerce.number().min(0),
  paymentMethod: z.enum(PAYMENT_METHODS),
  paymentDate: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function PaymentCreatePage() {
  const { t } = useTranslation(['payment', 'common'])
  const navigate = useNavigate()
  const [createPayment, { isLoading, error }] = useCreatePaymentMutation()

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: 'CASH',
      totalAmount: 0,
      amountPaid: 0,
    },
  })

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await createPayment(data).unwrap()
      navigate('/payments')
    } catch {
      // error handled via RTK Query state
    }
  }

  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message ?? t('payment:messages.createError')
      : t('payment:messages.createError')
    : undefined

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/payments')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('payment:title.create')}</h1>
      </div>
      <Card>
        <div className="p-6">
          {errorMessage && <Alert variant="error" message={errorMessage} className="mb-4" />}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('payment:form.patientName')}
                error={errors.patientName?.message}
                {...register('patientName')}
              />
              <Input
                label={t('payment:form.invoiceId')}
                placeholder="INV..."
                error={errors.invoiceId?.message}
                {...register('invoiceId')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('payment:form.totalAmount')}
                type="number"
                step="0.01"
                error={errors.totalAmount?.message}
                {...register('totalAmount')}
              />
              <Input
                label={t('payment:form.amountPaid')}
                type="number"
                step="0.01"
                error={errors.amountPaid?.message}
                {...register('amountPaid')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label={t('payment:form.paymentMethod')}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    error={errors.paymentMethod?.message}
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{t(`payment:method.${m}`)}</SelectItem>
                    ))}
                  </SelectField>
                )}
              />
              <Input
                label={t('payment:form.paymentDate')}
                type="date"
                error={errors.paymentDate?.message}
                {...register('paymentDate')}
              />
            </div>
            <Input
              label={t('payment:form.notes')}
              error={errors.notes?.message}
              {...register('notes')}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={isLoading}>
                {t('common:actions.save')}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
