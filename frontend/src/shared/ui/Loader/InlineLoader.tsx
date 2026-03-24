import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface InlineLoaderProps {
  className?: string
}

export function InlineLoader({ className }: InlineLoaderProps) {
  return <Loader2 className={cn('text-primary size-4 animate-spin', className)} />
}
