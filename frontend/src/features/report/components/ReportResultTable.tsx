import { useTranslation } from 'react-i18next'
import { ResultFlagBadge } from '@/features/result/components/ResultFlagBadge'
import { ReferenceRange } from '@/features/result/components/ReferenceRange'
import { ResultSummaryDto } from '@/features/report/api/reportApi'
import { formatDateTime } from '@/shared/utils/formatDate'

interface ReportResultTableProps {
  results: ResultSummaryDto[]
}

export function ReportResultTable({ results }: ReportResultTableProps) {
  const { t } = useTranslation('result')

  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-neutral-400">
        Aucun résultat disponible
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left">
            <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase w-20">Code</th>
            <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Analyse</th>
            <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
              {t('fields.value')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
              {t('fields.unit')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Référence</th>
            <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
              {t('fields.flag')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">
              {t('fields.measuredAt')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {results.map((r) => (
            <tr
              key={r.id}
              className={r.flag === 'CRITICAL' ? 'bg-red-50' : undefined}
            >
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">{r.testCode}</td>
              <td className="px-4 py-3 font-medium text-neutral-800">{r.testNameFr}</td>
              <td className="px-4 py-3 font-medium text-neutral-900">{r.value}</td>
              <td className="px-4 py-3 text-neutral-500">{r.unit ?? '–'}</td>
              <td className="px-4 py-3 text-neutral-500">
                <ReferenceRange low={r.referenceLow} high={r.referenceHigh} unit={r.unit ?? null} />
              </td>
              <td className="px-4 py-3">
                <ResultFlagBadge flag={r.flag} />
              </td>
              <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                {formatDateTime(r.measuredAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
