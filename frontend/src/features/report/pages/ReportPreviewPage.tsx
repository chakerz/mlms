import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { ReportHeader } from '@/features/report/components/ReportHeader'
import { ReportResultTable } from '@/features/report/components/ReportResultTable'
import { useGetReportQuery } from '@/features/report/api/reportApi'

export function ReportPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('report')
  const navigate = useNavigate()

  const { data, isLoading, isError } = useGetReportQuery(id!)

  if (isLoading) return <PageLoader />
  if (isError || !data) return <Alert variant="error" message={t('messages.notFound')} />

  const { report, patient, order, results } = data

  return (
    <div>
      {/* Screen-only toolbar */}
      <div className="flex items-center gap-3 mb-6 print:hidden">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/reports/${id}`)}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('previewTitle')}</h1>
        <Button size="sm" className="ms-auto" onClick={() => window.print()}>
          <Printer size={15} className="me-1" />
          Imprimer
        </Button>
      </div>

      {/* Print area */}
      <div
        id="report-print-area"
        className="bg-white border border-neutral-200 rounded-xl p-8 space-y-6 max-w-4xl mx-auto print:border-0 print:rounded-none print:p-0 print:max-w-none"
      >
        {/* Lab header */}
        <div className="flex justify-between items-start pb-4 border-b-2 border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">MLMS – Laboratoire Médical</h2>
            <p className="text-sm text-neutral-500 mt-1">Système de Gestion de Laboratoire</p>
          </div>
          <div className="text-right text-xs text-neutral-500">
            <p>Rapport #{report.id.slice(-10)}</p>
            <p>Template: {report.templateVersion}</p>
          </div>
        </div>

        {/* Patient and order info */}
        <ReportHeader report={report} patient={patient} order={order} />

        {/* Comments */}
        {(report.commentsFr || report.commentsAr) && (
          <div className="border-t border-neutral-200 pt-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Commentaires du médecin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.commentsFr && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-neutral-400 uppercase mb-2">
                    {t('fields.commentsFr')}
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed">{report.commentsFr}</p>
                </div>
              )}
              {report.commentsAr && (
                <div className="bg-neutral-50 rounded-lg p-4" dir="rtl">
                  <p className="text-xs font-medium text-neutral-400 uppercase mb-2">
                    {t('fields.commentsAr')}
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed">{report.commentsAr}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="border-t border-neutral-200 pt-4">
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Résultats ({results.length})
          </h3>
          <ReportResultTable results={results} />
        </div>

        {/* Signature block */}
        {report.signedBy && (
          <div className="border-t border-neutral-200 pt-4 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-neutral-400">{t('fields.signedBy')}</p>
              <p className="text-sm font-medium text-neutral-800 font-mono">
                {report.signedBy}
              </p>
              {report.signedAt && (
                <p className="text-xs text-neutral-400">
                  {new Date(report.signedAt).toLocaleString('fr-FR')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
