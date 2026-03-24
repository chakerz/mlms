import { useTranslation } from 'react-i18next'
import { useGetPortalReportsQuery } from '../api/portalApi'
import { ReportCard } from '../components/ReportCard'
import { PageLoader } from '@/shared/ui/Loader'
import { Alert } from '@/shared/ui/Alert'

export function MyReportsPage() {
  const { t } = useTranslation('portal')
  const { data, isLoading, isError } = useGetPortalReportsQuery({})

  if (isLoading) return <PageLoader />
  if (isError) return <Alert variant="error" message={t('messages.noReports')} />

  const reports = data?.data ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('myReports')}</h1>
      {reports.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-base">{t('messages.noReports')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
