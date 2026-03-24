import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { useGetPortalReportQuery } from '../api/portalApi'
import { ReportPdfViewer } from '../components/ReportPdfViewer'
import { DownloadButton } from '../components/DownloadButton'
import { PageLoader } from '@/shared/ui/Loader'
import { Alert } from '@/shared/ui/Alert'

export function MyReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('portal')
  const navigate = useNavigate()

  const { data, isLoading, isError } = useGetPortalReportQuery(id!)

  if (isLoading) return <PageLoader />
  if (isError || !data) return <Alert variant="error" message={t('messages.noReports')} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={() => navigate('/portal/reports')}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('myReports')}
        </button>
        <DownloadButton />
      </div>
      <ReportPdfViewer data={data} />
    </div>
  )
}
