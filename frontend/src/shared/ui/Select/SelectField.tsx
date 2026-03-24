import { ReactNode } from 'react'
import { Label } from '@/shared/ui/shadcn/label'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select'

interface SelectFieldProps {
  label?: string
  error?: string
  hint?: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  children: ReactNode
  required?: boolean
}

export function SelectField({
  label,
  error,
  hint,
  value,
  onValueChange,
  placeholder,
  disabled,
  children,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger aria-invalid={!!error || undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
