import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/shared/ui/shadcn/alert'
import { ResultDto } from '@/features/result/api/resultApi'

interface CriticalAlertProps {
  results: ResultDto[]
}

export function CriticalAlert({ results }: CriticalAlertProps) {
  const { t, i18n } = useTranslation('result')
  const critical = results.filter((r) => r.flag === 'CRITICAL')

  if (critical.length === 0) return null

  return (
    <div className="flex flex-col gap-2 mb-4">
      {critical.map((r) => (
        <Alert key={r.id} variant="destructive" appearance="light" size="md">
          <AlertIcon>
            <AlertTriangle />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>
              {t('flags.CRITICAL')} — {i18n.language === 'ar' ? r.testNameAr : r.testNameFr}
            </AlertTitle>
            <AlertDescription>
              {t('fields.value')}: <strong>{r.value}</strong>
              {r.unit && <span className="ms-1">{r.unit}</span>}
              {(r.referenceLow !== null || r.referenceHigh !== null) && (
                <span className="ms-2 text-xs opacity-75">
                  (réf: {r.referenceLow ?? '–'} – {r.referenceHigh ?? '–'})
                </span>
              )}
            </AlertDescription>
          </AlertContent>
        </Alert>
      ))}
    </div>
  )
}
