import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/ui/Badge'
import { ReportDto, PatientSummaryDto, OrderSummaryDto } from '@/features/report/api/reportApi'
import { formatDateTime } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  DRAFT: 'yellow',
  VALIDATED: 'blue',
  FINAL: 'emerald',
  CORRECTED: 'orange',
  PUBLISHED: 'green',
}

interface ReportHeaderProps {
  report: ReportDto
  patient: PatientSummaryDto
  order: OrderSummaryDto
}

export function ReportHeader({ report, patient, order }: ReportHeaderProps) {
  const { t } = useTranslation(['report', 'statuses'])

  return (
    <div className="space-y-4">
      {/* Status + meta row */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={STATUS_VARIANT[report.status] ?? 'gray'}>
          {t(`statuses:report.${report.status}`)}
        </Badge>
        <span className="text-xs text-neutral-400 font-mono">v{report.templateVersion}</span>
        <span className="text-xs text-neutral-400">
          Créé le {formatDateTime(report.createdAt)}
        </span>
      </div>

      {/* Patient + order info grid */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <dt className="text-xs font-medium text-neutral-400 uppercase">Patient</dt>
          <dd className="mt-1 text-sm text-neutral-800 font-medium">
            {patient.lastName} {patient.firstName}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-neutral-400 uppercase">Date de naissance</dt>
          <dd className="mt-1 text-sm text-neutral-800">
            {new Date(patient.birthDate).toLocaleDateString('fr-FR')}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-neutral-400 uppercase">Commande</dt>
          <dd className="mt-1 text-sm font-mono text-neutral-600">{order.id.slice(-10)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-neutral-400 uppercase">Priorité</dt>
          <dd className="mt-1 text-sm text-neutral-800">{order.priority}</dd>
        </div>
      </dl>

      {/* Workflow timestamps */}
      {(report.validatedAt || report.signedAt || report.publishedAt) && (
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
          {report.validatedAt && (
            <div>
              <dt className="text-xs font-medium text-neutral-400 uppercase">
                {t('report:fields.validatedAt')}
              </dt>
              <dd className="mt-1 text-xs text-neutral-600">{formatDateTime(report.validatedAt)}</dd>
            </div>
          )}
          {report.signedAt && (
            <div>
              <dt className="text-xs font-medium text-neutral-400 uppercase">
                {t('report:fields.signedAt')}
              </dt>
              <dd className="mt-1 text-xs text-neutral-600">{formatDateTime(report.signedAt)}</dd>
            </div>
          )}
          {report.publishedAt && (
            <div>
              <dt className="text-xs font-medium text-neutral-400 uppercase">
                {t('report:fields.publishedAt')}
              </dt>
              <dd className="mt-1 text-xs text-neutral-600">{formatDateTime(report.publishedAt)}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}
