import { HTMLAttributes } from 'react'
import { CardHeader as ShadcnCardHeader, CardTitle, CardToolbar } from '@/shared/ui/shadcn/card'

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  action?: React.ReactNode
  /** Alias for action */
  actions?: React.ReactNode
}

export function CardHeader({ title, action, actions, className, children, ...props }: CardHeaderProps) {
  const actionContent = action ?? actions
  return (
    <ShadcnCardHeader className={className} {...props}>
      {title ? (
        <>
          <CardTitle>{title}</CardTitle>
          {actionContent && <CardToolbar>{actionContent}</CardToolbar>}
        </>
      ) : (
        children
      )}
    </ShadcnCardHeader>
  )
}
