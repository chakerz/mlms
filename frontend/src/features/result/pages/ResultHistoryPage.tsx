import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/shadcn/card'
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
} from '@/shared/ui/shadcn/alert'
import { ResultTable } from '@/features/result/components/ResultTable'
import { CriticalAlert } from '@/features/result/components/CriticalAlert'
import { useGetResultsByOrderQuery } from '@/features/result/api/resultApi'
import { useGetOrderQuery } from '@/features/order/api/orderApi'

export function ResultHistoryPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { t } = useTranslation(['result', 'common'])
  const navigate = useNavigate()

  const { data: order } = useGetOrderQuery(orderId!)
  const {
    data: results = [],
    isLoading,
    isError,
  } = useGetResultsByOrderQuery(orderId!)

  if (isError) {
    return (
      <Alert variant="destructive" appearance="light">
        <AlertIcon><AlertCircle /></AlertIcon>
        <AlertContent><AlertDescription>{t('result:messages.loadError')}</AlertDescription></AlertContent>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          mode="icon"
          className="size-8"
          onClick={() => navigate(`/orders/${orderId}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t('result:historyTitle')}</h1>
        {order && (
          <span className="text-sm text-muted-foreground font-mono">#{order.id.slice(-8)}</span>
        )}
      </div>

      <CriticalAlert results={results} />

      <Card>
        <CardHeader>
          <CardTitle>{t('result:historyTitle')}</CardTitle>
          {order && (
            <CardDescription>
              {t('common:navigation.orders')} #{order.id.slice(-8)}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ResultTable results={results} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
