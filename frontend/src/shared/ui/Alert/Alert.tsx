import { HTMLAttributes } from 'react'
import {
  Alert as ShadcnAlert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from '@/shared/ui/shadcn/alert'
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type?: AlertType
  /** Alias for type */
  variant?: AlertType
  title?: string
  message?: string
}

const typeMap: Record<AlertType, { variant: 'success' | 'destructive' | 'warning' | 'info'; Icon: React.ElementType }> = {
  success: { variant: 'success', Icon: CheckCircle2 },
  error:   { variant: 'destructive', Icon: AlertCircle },
  warning: { variant: 'warning', Icon: AlertTriangle },
  info:    { variant: 'info', Icon: Info },
}

export function Alert({ type, variant, title, message, className, children, ...props }: AlertProps) {
  const resolved = type ?? variant ?? 'info'
  const { variant: shadcnVariant, Icon } = typeMap[resolved]
  return (
    <ShadcnAlert variant={shadcnVariant} appearance="light" className={className} {...(props as any)}>
      <AlertIcon><Icon /></AlertIcon>
      <AlertContent>
        {title && <AlertTitle>{title}</AlertTitle>}
        {(message || children) && <AlertDescription>{message ?? children}</AlertDescription>}
      </AlertContent>
    </ShadcnAlert>
  )
}
