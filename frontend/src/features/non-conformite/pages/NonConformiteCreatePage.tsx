import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader } from '@/shared/ui/Card'
import { NonConformiteForm } from '../components/NonConformiteForm'
import { useCreateNonConformiteMutation } from '../api/nonConformiteApi'

export function NonConformiteCreatePage() {
  const { t } = useTranslation('nonConformite')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const specimenId = searchParams.get('specimenId') ?? undefined
  const orderId = searchParams.get('orderId') ?? undefined

  const [create, { isLoading, error }] = useCreateNonConformiteMutation()

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    try {
      await create(data).unwrap()
      navigate('/non-conformites')
    } catch {
      // error shown via mutation state
    }
  }

  const errMsg = error
    ? 'data' in error
      ? (error.data as { message?: string })?.message
      : 'Erreur'
    : undefined

  return (
    <div className="max-w-xl mx-auto">
      <CardHeader title={t('createTitle')} className="mb-4" />
      <Card>
        <div className="p-6">
          <NonConformiteForm
            defaultSpecimenId={specimenId}
            defaultOrderId={orderId}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={errMsg}
          />
        </div>
      </Card>
    </div>
  )
}
