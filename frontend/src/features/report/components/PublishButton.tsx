import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { ConfirmDialog } from '@/shared/ui/Modal'
import { useDisclosure } from '@/shared/hooks/useDisclosure'

interface PublishButtonProps {
  reportId: string
  onPublish: () => Promise<void>
  isLoading?: boolean
}

export function PublishButton({ onPublish, isLoading }: PublishButtonProps) {
  const { t } = useTranslation('report')
  const dialog = useDisclosure()

  const handleConfirm = async () => {
    await onPublish()
    dialog.close()
  }

  return (
    <>
      <Button size="sm" onClick={dialog.open} loading={isLoading}>
        <Globe size={15} className="me-1" />
        {t('actions.publish')}
      </Button>

      <ConfirmDialog
        open={dialog.isOpen}
        onClose={dialog.close}
        onConfirm={handleConfirm}
        title={t('actions.publish')}
        message={t('messages.publishConfirm')}
        isLoading={isLoading}
      />
    </>
  )
}
