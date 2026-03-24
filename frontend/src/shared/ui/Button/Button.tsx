import { ButtonHTMLAttributes } from 'react'
import { Button as ShadcnButton } from '@/shared/ui/shadcn/button'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  asChild?: boolean
}

// Map legacy MLMS variants → reference button variants
const variantMap: Record<Variant, 'primary' | 'secondary' | 'destructive' | 'ghost'> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'destructive',
  ghost: 'ghost',
}

const sizeMap: Record<Size, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, className, children, asChild, ...props }: ButtonProps) {
  return (
    <ShadcnButton
      {...(props as any)}
      asChild={asChild}
      variant={variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled ?? loading}
      className={className}
    >
      {asChild ? children : <>{loading && <Loader2 className="animate-spin" />}{children}</>}
    </ShadcnButton>
  )
}
