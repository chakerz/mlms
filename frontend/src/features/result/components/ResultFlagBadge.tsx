import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/shared/ui/shadcn/badge'

const FLAG_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'destructive' | 'secondary'> = {
  N: 'success',
  H: 'warning',
  L: 'info',
  HH: 'destructive',
  LL: 'destructive',
  CRITICAL: 'destructive',
}

interface ResultFlagBadgeProps {
  flag: string
  className?: string
}

export function ResultFlagBadge({ flag, className }: ResultFlagBadgeProps) {
  const { t } = useTranslation('result')
  const variant = FLAG_VARIANT[flag] ?? 'secondary'

  return (
    <Badge
      variant={variant}
      appearance={flag === 'CRITICAL' ? 'solid' : 'light'}
      className={className}
    >
      {flag === 'CRITICAL' && <AlertTriangle className="size-3 me-1" />}
      {t(`flags.${flag}`, { defaultValue: flag })}
    </Badge>
  )
}
