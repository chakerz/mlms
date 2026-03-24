import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardToolbar,
} from '@/shared/ui/shadcn/card'
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
} from '@/shared/ui/shadcn/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/shared/ui/shadcn/dialog'
import { ResultTable } from '@/features/result/components/ResultTable'
import { ResultForm } from '@/features/result/components/ResultForm'
import { CriticalAlert } from '@/features/result/components/CriticalAlert'
import { useGetSpecimenQuery } from '@/features/specimen/api/specimenApi'
import { useGetOrderQuery } from '@/features/order/api/orderApi'
import {
  useGetResultsBySpecimenQuery,
  useUpdateResultMutation,
  ResultDto,
  UpdateResultRequest,
} from '@/features/result/api/resultApi'

export function ResultReviewPage() {
  const { specimenId } = useParams<{ specimenId: string }>()
  const { t } = useTranslation(['result', 'common'])
  const navigate = useNavigate()

  const { data: specimen, isLoading: specimenLoading } = useGetSpecimenQuery(specimenId!)
  const { data: order } = useGetOrderQuery(specimen?.orderId ?? '', {
    skip: !specimen?.orderId,
  })
  const {
    data: results = [],
    isLoading: resultsLoading,
    isError,
  } = useGetResultsBySpecimenQuery(specimenId!)

  const [updateResult, { isLoading: isUpdating }] = useUpdateResultMutation()

  const [editingResult, setEditingResult] = useState<ResultDto | null>(null)
  const [editError, setEditError] = useState<string | undefined>()

  const isLoading = specimenLoading || resultsLoading
  const testOptions = order?.tests ?? []

  const handleEdit = (result: ResultDto) => {
    setEditError(undefined)
    setEditingResult(result)
  }

  const handleEditSubmit = async (data: { id: string } & UpdateResultRequest) => {
    setEditError(undefined)
    try {
      await updateResult(data).unwrap()
      setEditingResult(null)
    } catch {
      setEditError(t('result:messages.updateError'))
    }
  }

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            mode="icon"
            className="size-8"
            onClick={() => navigate(specimen ? `/specimens/${specimen.id}` : '/orders')}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">{t('result:reviewTitle')}</h1>
        </div>
        <Button size="sm" onClick={() => navigate(`/specimens/${specimenId}/results/new`)}>
          <Plus className="size-4" />
          {t('result:actions.new')}
        </Button>
      </div>

      <CriticalAlert results={results} />

      <Card>
        <CardHeader>
          <CardTitle>{t('result:reviewTitle')}</CardTitle>
          {specimen && (
            <CardDescription>
              {t('result:fields.specimen')} : <span className="font-mono">{specimen.barcode}</span>
            </CardDescription>
          )}
          <CardToolbar />
        </CardHeader>
        <CardContent className="p-0">
          <ResultTable results={results} onEdit={handleEdit} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Dialog open={!!editingResult} onOpenChange={(open) => { if (!open) setEditingResult(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('result:actions.edit')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {editingResult && (
              <ResultForm
                specimenId={specimenId!}
                testOptions={testOptions}
                existingResult={editingResult}
                onSubmit={(data) => handleEditSubmit(data as { id: string } & UpdateResultRequest)}
                onCancel={() => setEditingResult(null)}
                isLoading={isUpdating}
                error={editError}
              />
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  )
}
