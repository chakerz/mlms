import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/Modal'
import { useDisclosure } from '@/shared/hooks/useDisclosure'

interface SignaturePanelProps {
  reportId: string
  onSign: () => Promise<void>
  isLoading?: boolean
}

export function SignaturePanel({ onSign, isLoading }: SignaturePanelProps) {
  const { t } = useTranslation('report')
  const dialog = useDisclosure()

  const handleConfirm = async () => {
    await onSign()
    dialog.close()
  }

  return (
    <>
      <Button size="sm" onClick={dialog.open} loading={isLoading}>
        <CheckCircle size={15} className="me-1" />
        {t('actions.sign')}
      </Button>

      <ConfirmDialog
        open={dialog.isOpen}
        onClose={dialog.close}
        onConfirm={handleConfirm}
        title={t('actions.sign')}
        message={t('messages.signConfirm')}
        isLoading={isLoading}
      />
    </>
  )
}
