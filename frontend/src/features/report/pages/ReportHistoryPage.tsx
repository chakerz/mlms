import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { Card } from '@/shared/ui/Card'
import { useGetReportsQuery } from '@/features/report/api/reportApi'
import { formatDateTime } from '@/shared/utils/formatDate'

export function ReportHistoryPage() {
  const { t } = useTranslation(['report', 'statuses', 'common'])
  const navigate = useNavigate()

  const { data, isLoading, isError } = useGetReportsQuery({ status: 'PUBLISHED' })

  if (isLoading) return <PageLoader />
  if (isError) return <Alert variant="error" message={t('common:states.error')} />

  const reports = data?.data ?? []

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('report:historyTitle')}</h1>
      </div>

      <Card>
        {reports.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-400">
            {t('common:states.empty')}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => navigate(`/reports/${report.id}`)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="green">
                      {t('statuses:report.PUBLISHED')}
                    </Badge>
                    <span className="text-xs text-neutral-400 font-mono">
                      #{report.id.slice(-8)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Commande : <span className="font-mono">{report.orderId.slice(-10)}</span>
                  </p>
                  {report.publishedAt && (
                    <p className="text-xs text-neutral-400 mt-1">
                      Publié le {formatDateTime(report.publishedAt)}
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-neutral-400 whitespace-nowrap">
                  {formatDateTime(report.createdAt)}
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
