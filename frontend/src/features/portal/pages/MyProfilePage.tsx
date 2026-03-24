import { useTranslation } from 'react-i18next'
import { useGetPortalMeQuery } from '../api/portalApi'
import { PageLoader } from '@/shared/ui/Loader'
import { Alert } from '@/shared/ui/Alert'
import { User, Phone, Mail, MapPin, Calendar } from 'lucide-react'

export function MyProfilePage() {
  const { t, i18n } = useTranslation('portal')
  const { data, isLoading, isError } = useGetPortalMeQuery()
  const isAr = i18n.language === 'ar'

  if (isLoading) return <PageLoader />
  if (isError || !data) return <Alert variant="error" message={t('messages.noReports')} />

  const fullName = `${data.firstName} ${data.lastName}`
  const birthDate = data.birthDate
    ? new Date(data.birthDate).toLocaleDateString()
    : '—'

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('profile')}</h1>
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
          <div className="bg-blue-100 rounded-full p-4">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-neutral-900">{fullName}</p>
            <p className="text-sm text-neutral-500">
              {isAr ? data.gender === 'M' ? 'ذكر' : 'أنثى' : data.gender === 'M' ? 'Homme' : 'Femme'}
            </p>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 text-neutral-600">
            <Calendar size={16} className="text-blue-500 flex-shrink-0" />
            <span>{isAr ? 'تاريخ الميلاد:' : 'Date de naissance :'} {birthDate}</span>
          </div>
          {data.phone && (
            <div className="flex items-center gap-3 text-neutral-600">
              <Phone size={16} className="text-blue-500 flex-shrink-0" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-3 text-neutral-600">
              <Mail size={16} className="text-blue-500 flex-shrink-0" />
              <span>{data.email}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-3 text-neutral-600">
              <MapPin size={16} className="text-blue-500 flex-shrink-0" />
              <span>{data.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
