import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ClipboardList } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Button } from '@/shared/ui/shadcn/button'

export function ResultsIndexPage() {
  const { t } = useTranslation(['result', 'common'])
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold text-foreground">{t('result:title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('result:title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 text-center py-8">
            <div className="p-4 rounded-full bg-accent">
              <ClipboardList className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('result:messages.selectOrder')}
            </p>
            <Button onClick={() => navigate('/orders')}>
              {t('common:navigation.orders')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
