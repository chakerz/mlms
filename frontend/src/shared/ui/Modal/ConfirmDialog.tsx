import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/ui/shadcn/dialog'
import { Button } from '@/shared/ui/Button'

interface ConfirmDialogProps {
  isOpen?: boolean
  /** Alias for isOpen */
  open?: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
  /** Alias for loading */
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  loading = false,
  isLoading,
}: ConfirmDialogProps) {
  const { t } = useTranslation('common')
  const busy = loading || isLoading
  return (
    <Dialog open={isOpen ?? open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title ?? t('confirm.title')}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {cancelLabel ?? t('actions.cancel')}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={busy}>
            {confirmLabel ?? t('actions.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
