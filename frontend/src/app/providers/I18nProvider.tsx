import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { applyDirection } from '@/i18n/rtl'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation()

  useEffect(() => {
    applyDirection(i18n.language as 'fr' | 'ar')
  }, [i18n.language])

  useEffect(() => {
    applyDirection(i18n.language as 'fr' | 'ar')
  }, [])

  return <>{children}</>
}
