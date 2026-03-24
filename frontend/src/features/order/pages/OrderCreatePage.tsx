import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { OrderForm } from '@/features/order/components/OrderForm'
import { useCreateOrderMutation, CreateOrderRequest } from '@/features/order/api/orderApi'

export function OrderCreatePage() {
  const { t } = useTranslation('order')
  const navigate = useNavigate()
  const [createOrder, { isLoading, error }] = useCreateOrderMutation()

  const handleSubmit = async (data: CreateOrderRequest) => {
    try {
      const order = await createOrder(data).unwrap()
      navigate(`/orders/${order.id}`)
    } catch {
      // error handled via RTK Query state
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('createTitle')}</h1>
      </div>
      <Card>
        <div className="p-6">
          <OrderForm onSubmit={handleSubmit} isLoading={isLoading} error={errorMessage} />
        </div>
      </Card>
    </div>
  )
}
