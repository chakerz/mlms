import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { SpecimenForm } from '@/features/specimen/components/SpecimenForm'
import { useCreateSpecimenMutation, CreateSpecimenRequest } from '@/features/specimen/api/specimenApi'

export function SpecimenCreatePage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { t } = useTranslation('specimen')
  const navigate = useNavigate()
  const [createSpecimen, { isLoading, error }] = useCreateSpecimenMutation()

  const handleSubmit = async (data: CreateSpecimenRequest) => {
    try {
      const specimen = await createSpecimen(data).unwrap()
      navigate(`/specimens/${specimen.id}`)
    } catch {
      // error state from RTK Query
    }
  }

  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message ?? t('messages.createError')
      : t('messages.createError')
    : undefined

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(orderId ? `/orders/${orderId}/specimens` : '/specimens')}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('createTitle')}</h1>
      </div>
      <Card>
        <div className="p-6">
          <SpecimenForm
            defaultOrderId={orderId}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={errorMessage}
          />
        </div>
      </Card>
    </div>
  )
}
