import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Input } from '@/shared/ui/Input'
import { useCreatePractitionerMutation } from '@/features/practitioner/api/practitionerApi'

const schema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  speciality: z.string().optional(),
  qualification: z.string().optional(),
  licenseNumber: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function PractitionerCreatePage() {
  const { t } = useTranslation(['practitioner', 'common'])
  const navigate = useNavigate()
  const [createPractitioner, { isLoading, error }] = useCreatePractitionerMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await createPractitioner(data).unwrap()
      navigate('/practitioners')
    } catch {
      // error handled via RTK Query state
    }
  }

  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message ?? t('practitioner:messages.createError')
      : t('practitioner:messages.createError')
    : undefined

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/practitioners')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('practitioner:title.create')}</h1>
      </div>
      <Card>
        <div className="p-6">
          {errorMessage && <Alert variant="error" message={errorMessage} className="mb-4" />}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('practitioner:form.fullName')}
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <Input
                label={t('common:labels.email')}
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('common:labels.phone')}
                type="tel"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />
              <Input
                label={t('practitioner:form.speciality')}
                error={errors.speciality?.message}
                {...register('speciality')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('practitioner:form.qualification')}
                error={errors.qualification?.message}
                {...register('qualification')}
              />
              <Input
                label={t('practitioner:form.licenseNumber')}
                error={errors.licenseNumber?.message}
                {...register('licenseNumber')}
              />
            </div>
            <Input
              label={t('common:labels.address')}
              error={errors.address?.message}
              {...register('address')}
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
