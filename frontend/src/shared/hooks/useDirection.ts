import { useTranslation } from 'react-i18next'
import { getDirection } from '@/i18n/helpers/getDirection'
import type { Direction } from '@/shared/types/app.types'

export function useDirection(): Direction {
  const { i18n } = useTranslation()
  return getDirection(i18n.language as 'fr' | 'ar')
}
