import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/features/auth/model/authSlice'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { FlaskConical, LogOut, User, FileText } from 'lucide-react'

export function PatientPortalLayout() {
  const { t, i18n } = useTranslation('portal')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const isRtl = i18n.language === 'ar'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-blue-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical size={22} className="text-blue-600" />
            <span className="font-bold text-blue-700 text-lg">{t('title')}</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/portal/reports"
              className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
            >
              <FileText size={15} />
              {t('myReports')}
            </Link>
            <Link
              to="/portal/profile"
              className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
            >
              <User size={15} />
              {t('profile')}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={15} />
              {user?.email}
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
