import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { useAuth } from '@/features/auth/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { t } = useTranslation('auth')
  const { login, isLoading, error } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert variant="error" message={error} />}
      <Input
        label={t('fields.email')}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={t('fields.password')}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" className="w-full" loading={isLoading}>
        {t('actions.login')}
      </Button>
    </form>
  )
}
