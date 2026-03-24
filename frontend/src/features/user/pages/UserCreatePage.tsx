import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Alert } from '@/shared/ui/Alert'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { useCreateUserMutation } from '@/features/user/api/userApi'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['RECEPTION', 'TECHNICIAN', 'PHYSICIAN', 'ADMIN']),
  language: z.enum(['FR', 'AR']),
})

type FormValues = z.infer<typeof schema>

export function UserCreatePage() {
  const { t } = useTranslation(['users', 'common'])
  const navigate = useNavigate()
  const [createUser, { isLoading, error }] = useCreateUserMutation()

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'RECEPTION', language: 'FR' },
  })

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await createUser(data).unwrap()
      navigate('/users')
    } catch {
      // error handled via RTK Query state
    }
  }

  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message ?? t('users:messages.createError')
      : t('users:messages.createError')
    : undefined

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t('users:titleCreate')}</h1>
      </div>

      <Card className="max-w-lg">
        <CardContent className="p-6">
          {errorMessage && <Alert variant="error" message={errorMessage} className="mb-4" />}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
              label={t('common:labels.email')}
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('users:form.password')}
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t('users:form.role')}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.role?.message}
                >
                  {(['RECEPTION', 'TECHNICIAN', 'PHYSICIAN', 'ADMIN'] as const).map((r) => (
                    <SelectItem key={r} value={r}>{t(`users:roles.${r}`)}</SelectItem>
                  ))}
                </SelectField>
              )}
            />
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t('users:form.language')}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.language?.message}
                >
                  <SelectItem value="FR">{t('common:language.fr')}</SelectItem>
                  <SelectItem value="AR">{t('common:language.ar')}</SelectItem>
                </SelectField>
              )}
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={isLoading}>
                {t('users:actions.create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
