import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, Calendar, Eye } from 'lucide-react'
import { PortalReportDto } from '../api/portalApi'

interface ReportCardProps {
  report: PortalReportDto
}

export function ReportCard({ report }: ReportCardProps) {
  const { t } = useTranslation('portal')
  const navigate = useNavigate()

  const date = report.publishedAt
    ? new Date(report.publishedAt).toLocaleDateString()
    : new Date(report.createdAt).toLocaleDateString()

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-5 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 rounded-full p-3">
          <FileText size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-800">
            {t('reportDetail')} — {report.id.slice(-8).toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-500">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate(`/portal/reports/${report.id}`)}
        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Eye size={15} />
        {t('actions.viewReport')}
      </button>
    </div>
  )
}
