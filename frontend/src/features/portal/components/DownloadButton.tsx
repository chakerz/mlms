import { useTranslation } from 'react-i18next'
import { Download } from 'lucide-react'

export function DownloadButton() {
  const { t } = useTranslation('portal')

  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors print:hidden"
    >
      <Download size={15} />
      {t('actions.downloadPdf')}
    </button>
  )
}
