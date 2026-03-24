import { HTMLAttributes } from 'react'
import { Badge as ShadcnBadge } from '@/shared/ui/shadcn/badge'

type BadgeVariant =
  | 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'outline'
  | 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

type VariantConfig = { variant: string; appearance?: 'light' | 'outline' | 'ghost' }

const variantMap: Record<BadgeVariant, VariantConfig> = {
  default:   { variant: 'secondary' },
  success:   { variant: 'success',     appearance: 'light' },
  warning:   { variant: 'warning',     appearance: 'light' },
  danger:    { variant: 'destructive', appearance: 'light' },
  info:      { variant: 'info',        appearance: 'light' },
  secondary: { variant: 'secondary' },
  outline:   { variant: 'outline' },
  // legacy color aliases
  gray:    { variant: 'secondary' },
  blue:    { variant: 'primary',     appearance: 'light' },
  green:   { variant: 'success',     appearance: 'light' },
  yellow:  { variant: 'warning',     appearance: 'light' },
  orange:  { variant: 'warning',     appearance: 'light' },
  red:     { variant: 'destructive', appearance: 'light' },
  emerald: { variant: 'success',     appearance: 'light' },
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const { variant: shadcnVariant, appearance } = variantMap[variant]
  return (
    <ShadcnBadge
      variant={shadcnVariant as any}
      appearance={appearance}
      className={className}
      {...props}
    />
  )
}
