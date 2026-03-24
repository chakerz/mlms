import { HTMLAttributes } from 'react'
import { Card as ShadcnCard } from '@/shared/ui/shadcn/card'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <ShadcnCard className={className} {...props}>
      {children}
    </ShadcnCard>
  )
}
