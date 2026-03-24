import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { applyDirection } from '@/i18n/rtl'
import { cn } from '@/shared/utils/cn'
import { useChangeLanguageMutation } from '@/features/auth/api/authApi'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { setCurrentUser } from '@/features/auth/model/authSlice'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const [changeLanguage] = useChangeLanguageMutation()

  const switchTo = async (lang: string) => {
    i18n.changeLanguage(lang)
    applyDirection(lang as 'fr' | 'ar')
    if (user) {
      const updated = await changeLanguage({ language: lang.toUpperCase() }).unwrap()
      dispatch(setCurrentUser(updated))
    }
  }

  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
      <button
        onClick={() => switchTo('fr')}
        className={cn(
          'px-3 py-1 rounded-md text-sm font-medium transition-colors',
          current === 'fr'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchTo('ar')}
        className={cn(
          'px-3 py-1 rounded-md text-sm font-medium transition-colors',
          current === 'ar'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
        )}
      >
        ع
      </button>
    </div>
  )
}
