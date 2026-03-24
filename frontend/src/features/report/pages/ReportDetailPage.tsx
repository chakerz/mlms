import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Eye } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { Card } from '@/shared/ui/Card'
import { ReportHeader } from '@/features/report/components/ReportHeader'
import { ReportResultTable } from '@/features/report/components/ReportResultTable'
import { ValidationActions } from '@/features/report/components/ValidationActions'
import { SignaturePanel } from '@/features/report/components/SignaturePanel'
import { PublishButton } from '@/features/report/components/PublishButton'
import {
  useGetReportQuery,
  useValidateReportMutation,
  useSignReportMutation,
  usePublishReportMutation,
} from '@/features/report/api/reportApi'

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['report', 'common'])
  const navigate = useNavigate()

  const { data, isLoading, isError } = useGetReportQuery(id!)
  const [validateReport, { isLoading: isValidating }] = useValidateReportMutation()
  const [signReport, { isLoading: isSigning }] = useSignReportMutation()
  const [publishReport, { isLoading: isPublishing }] = usePublishReportMutation()

  if (isLoading) return <PageLoader />
  if (isError || !data) return <Alert variant="error" message={t('report:messages.notFound')} />

  const { report, patient, order, results } = data

  const handleValidate = async (commentsFr: string | null, commentsAr: string | null) => {
    await validateReport({ id: id!, commentsFr, commentsAr }).unwrap()
  }

  const handleSign = async () => {
    await signReport({ id: id! }).unwrap()
  }

  const handlePublish = async () => {
    await publishReport({ id: id!, publishToPortal: true }).unwrap()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900">{t('report:detailTitle')}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/reports/${id}/preview`)}
          >
            <Eye size={15} className="me-1" />
            {t('report:actions.preview')}
          </Button>

          {report.status === 'DRAFT' && (
            <ValidationActions
              reportId={id!}
              onValidate={handleValidate}
              isLoading={isValidating}
            />
          )}

          {report.status === 'VALIDATED' && (
            <SignaturePanel
              reportId={id!}
              onSign={handleSign}
              isLoading={isSigning}
            />
          )}

          {report.status === 'FINAL' && (
            <PublishButton
              reportId={id!}
              onPublish={handlePublish}
              isLoading={isPublishing}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="p-6">
            <ReportHeader report={report} patient={patient} order={order} />
          </div>
        </Card>

        {(report.commentsFr || report.commentsAr) && (
          <Card>
            <div className="px-6 py-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-700">{t('report:fields.comments')}</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.commentsFr && (
                <div>
                  <p className="text-xs font-medium text-neutral-400 uppercase mb-1">
                    {t('report:fields.commentsFr')}
                  </p>
                  <p className="text-sm text-neutral-700">{report.commentsFr}</p>
                </div>
              )}
              {report.commentsAr && (
                <div dir="rtl">
                  <p className="text-xs font-medium text-neutral-400 uppercase mb-1">
                    {t('report:fields.commentsAr')}
                  </p>
                  <p className="text-sm text-neutral-700">{report.commentsAr}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        <Card>
          <div className="px-6 py-4 border-b border-neutral-100">
            <h3 className="text-sm font-semibold text-neutral-700">
              {t('report:fields.results', { count: results.length })}
            </h3>
          </div>
          <ReportResultTable results={results} />
        </Card>
      </div>
    </div>
  )
}
