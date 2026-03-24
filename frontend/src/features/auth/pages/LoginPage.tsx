import { useTranslation } from 'react-i18next'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { LanguageSwitcher } from '@/features/auth/components/LanguageSwitcher'

export function LoginPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600 mb-1">MLMS</h1>
          <h2 className="text-lg font-semibold text-neutral-900">{t('title')}</h2>
          <p className="text-sm text-neutral-500 mt-1">{t('subtitle')}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
