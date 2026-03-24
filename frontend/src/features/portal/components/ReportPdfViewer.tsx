import { useTranslation } from 'react-i18next'
import { PortalReportDetailDto } from '../api/portalApi'

interface ReportPdfViewerProps {
  data: PortalReportDetailDto
}

const FLAG_LABEL: Record<string, string> = {
  N: '',
  H: '↑',
  L: '↓',
  HH: '↑↑',
  LL: '↓↓',
  A: '!',
}

export function ReportPdfViewer({ data }: ReportPdfViewerProps) {
  const { report, patient, results } = data
  const { i18n } = useTranslation('portal')
  const isAr = i18n.language === 'ar'

  const patientName = `${patient.firstName} ${patient.lastName}`
  const publishedDate = report.publishedAt
    ? new Date(report.publishedAt).toLocaleDateString()
    : '—'

  return (
    <div
      className="bg-white rounded-lg border border-neutral-200 p-8 print:border-0 print:p-4"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="border-b border-neutral-300 pb-6 mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-1">
            {isAr ? 'تقرير نتائج التحليل' : 'Rapport de résultats'}
          </h1>
          <p className="text-sm text-neutral-500">
            {isAr ? 'تاريخ النشر:' : 'Publié le :'} {publishedDate}
          </p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          {isAr ? 'منشور' : 'PUBLIÉ'}
        </span>
      </div>

      {/* Patient info */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase mb-1">
            {isAr ? 'المريض' : 'Patient'}
          </p>
          <p className="font-medium text-neutral-800">{patientName}</p>
          {patient.birthDate && (
            <p className="text-neutral-500">
              {isAr ? 'تاريخ الميلاد:' : 'Né(e) le :'}{' '}
              {new Date(patient.birthDate).toLocaleDateString()}
            </p>
          )}
        </div>
        {(report.commentsFr || report.commentsAr) && (
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase mb-1">
              {isAr ? 'ملاحظات' : 'Commentaires'}
            </p>
            <p className="text-neutral-700 text-sm">
              {isAr ? report.commentsAr : report.commentsFr}
            </p>
          </div>
        )}
      </div>

      {/* Results table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-blue-50 text-blue-800">
            <th className="text-start p-3 font-semibold border border-neutral-200">
              {isAr ? 'الفحص' : 'Analyse'}
            </th>
            <th className="text-start p-3 font-semibold border border-neutral-200">
              {isAr ? 'النتيجة' : 'Résultat'}
            </th>
            <th className="text-start p-3 font-semibold border border-neutral-200">
              {isAr ? 'الوحدة' : 'Unité'}
            </th>
            <th className="text-start p-3 font-semibold border border-neutral-200">
              {isAr ? 'المرجع' : 'Référence'}
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const isAbnormal = r.flag !== 'N'
            return (
              <tr key={r.id} className={isAbnormal ? 'bg-red-50' : ''}>
                <td className="p-3 border border-neutral-200">
                  {isAr ? r.testNameAr : r.testNameFr}
                </td>
                <td className="p-3 border border-neutral-200 font-semibold">
                  <span className={isAbnormal ? 'text-red-700' : 'text-neutral-800'}>
                    {r.value}{' '}
                    {FLAG_LABEL[r.flag] && (
                      <span className="text-red-500 text-xs">{FLAG_LABEL[r.flag]}</span>
                    )}
                  </span>
                </td>
                <td className="p-3 border border-neutral-200 text-neutral-500">{r.unit ?? '—'}</td>
                <td className="p-3 border border-neutral-200 text-neutral-500">
                  {r.referenceLow != null && r.referenceHigh != null
                    ? `${r.referenceLow} – ${r.referenceHigh}`
                    : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
