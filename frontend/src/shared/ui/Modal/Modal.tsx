import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/shadcn/dialog'
import { cn } from '@/shared/utils/cn'

interface ModalProps {
  isOpen?: boolean
  /** Alias for isOpen */
  open?: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
}

export function Modal({ isOpen, open, onClose, title, children, footer, size = 'md', className }: ModalProps) {
  return (
    <Dialog open={isOpen ?? open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn(sizeMap[size], className)}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div>{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
