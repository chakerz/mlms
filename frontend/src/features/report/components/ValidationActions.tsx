import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { useDisclosure } from '@/shared/hooks/useDisclosure'

interface ValidationActionsProps {
  reportId: string
  onValidate: (commentsFr: string | null, commentsAr: string | null) => Promise<void>
  isLoading?: boolean
}

export function ValidationActions({ onValidate, isLoading }: ValidationActionsProps) {
  const { t } = useTranslation(['report', 'common'])
  const dialog = useDisclosure()
  const [commentsFr, setCommentsFr] = useState('')
  const [commentsAr, setCommentsAr] = useState('')

  const handleConfirm = async () => {
    await onValidate(commentsFr || null, commentsAr || null)
    dialog.close()
  }

  return (
    <>
      <Button size="sm" onClick={dialog.open} loading={isLoading}>
        {t('report:actions.validate')}
      </Button>

      <Modal
        open={dialog.isOpen}
        onClose={dialog.close}
        title={t('report:actions.validate')}
      >
        <p className="text-sm text-neutral-600 mb-4">{t('report:messages.validateConfirm')}</p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t('report:fields.commentsFr')}
            </label>
            <textarea
              value={commentsFr}
              onChange={(e) => setCommentsFr(e.target.value)}
              rows={3}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Commentaire clinique en français..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t('report:fields.commentsAr')}
            </label>
            <textarea
              value={commentsAr}
              onChange={(e) => setCommentsAr(e.target.value)}
              rows={3}
              dir="rtl"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="تعليق سريري بالعربية..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={dialog.close}>
            {t('common:actions.cancel')}
          </Button>
          <Button onClick={handleConfirm} loading={isLoading}>
            {t('report:actions.validate')}
          </Button>
        </div>
      </Modal>
    </>
  )
}
