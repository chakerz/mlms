import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { SelectField, SelectItem } from '@/shared/ui/Select'

const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  gender: z.enum(['M', 'F', 'O']),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
})

export type PatientFormValues = z.infer<typeof patientSchema>

interface PatientFormProps {
  defaultValues?: Partial<PatientFormValues>
  onSubmit: (data: PatientFormValues) => void
  isLoading?: boolean
}

export function PatientForm({ defaultValues, onSubmit, isLoading }: PatientFormProps) {
  const { t } = useTranslation('patient')

  const { register, handleSubmit, control, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('form.firstName')}
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label={t('form.lastName')}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('form.birthDate')}
          type="date"
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <SelectField
              label={t('form.gender')}
              value={field.value ?? ''}
              onValueChange={field.onChange}
              error={errors.gender?.message}
            >
              <SelectItem value="M">{t('gender.M')}</SelectItem>
              <SelectItem value="F">{t('gender.F')}</SelectItem>
              <SelectItem value="O">{t('gender.O')}</SelectItem>
            </SelectField>
          )}
        />
      </div>
      <Input
        label={t('form.phone')}
        type="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Input
        label={t('form.email')}
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={t('form.address')}
        error={errors.address?.message}
        {...register('address')}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {t('actions.save')}
        </Button>
      </div>
    </form>
  )
}
