import { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import { InboxIcon } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="text-muted-foreground mb-4">
        {icon ?? <InboxIcon className="size-12 opacity-40" />}
      </div>
      {title && (
        <h3 className="text-foreground mb-1 text-sm font-medium">{title}</h3>
      )}
      {description && (
        <p className="text-muted-foreground mb-4 text-sm">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
