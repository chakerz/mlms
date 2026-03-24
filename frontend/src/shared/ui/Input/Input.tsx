import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'
import { Input as ShadcnInput } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <Label htmlFor={inputId}>{label}</Label>
        )}
        <ShadcnInput
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={cn(className)}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
