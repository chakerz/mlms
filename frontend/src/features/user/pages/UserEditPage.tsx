import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { SelectField, SelectItem } from '@/shared/ui/Select'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Label } from '@/shared/ui/shadcn/label'
import { useGetUserByIdQuery, useUpdateUserMutation, UserDto } from '@/features/user/api/userApi'

const schema = z.object({
  role: z.enum(['RECEPTION', 'TECHNICIAN', 'PHYSICIAN', 'ADMIN']),
  language: z.enum(['FR', 'AR']),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

function UserEditForm({ user }: { user: UserDto }) {
  const { t } = useTranslation(['users', 'common'])
  const navigate = useNavigate()
  const [updateUser, { isLoading: isUpdating, error }] = useUpdateUserMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: user.role as FormValues['role'],
      language: user.language as FormValues['language'],
      isActive: user.isActive,
    },
  })

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await updateUser({ id: user.id, ...data }).unwrap()
      navigate('/users')
    } catch {
      // error handled via RTK Query state
    }
  }

  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message ?? t('users:messages.updateError')
      : t('users:messages.updateError')
    : undefined

  return (
    <>
      {errorMessage && <Alert variant="error" message={errorMessage} className="mb-4" />}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="isActive"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              />
              <Label htmlFor="isActive">{t('users:form.active')}</Label>
            </div>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={isUpdating}>
            {t('common:actions.save')}
          </Button>
        </div>
      </form>
    </>
  )
}

export function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['users', 'common'])
  const navigate = useNavigate()

  const { data: user, isLoading } = useGetUserByIdQuery(id!)

  if (isLoading) return <PageLoader />
  if (!user) return <Alert variant="error" message={t('users:messages.notFound')} />

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t('users:titleEdit')}</h1>
        <span className="text-sm text-muted-foreground font-mono">{user.email}</span>
      </div>

      <Card className="max-w-lg">
        <CardContent className="p-6">
          <UserEditForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
