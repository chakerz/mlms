import { useState } from 'react'
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
import { ResultForm } from '@/features/result/components/ResultForm'
import { useGetSpecimenQuery } from '@/features/specimen/api/specimenApi'
import { useGetOrderQuery } from '@/features/order/api/orderApi'
import { useRecordResultMutation, RecordResultRequest } from '@/features/result/api/resultApi'

export function ResultEntryPage() {
  const { specimenId } = useParams<{ specimenId: string }>()
  const { t } = useTranslation(['result', 'common'])
  const navigate = useNavigate()

  const { data: specimen, isLoading: specimenLoading } = useGetSpecimenQuery(specimenId!)
  const { data: order, isLoading: orderLoading } = useGetOrderQuery(specimen?.orderId ?? '', {
    skip: !specimen?.orderId,
  })

  const [recordResult, { isLoading: isSubmitting, error }] = useRecordResultMutation()
  const [submitError, setSubmitError] = useState<string | undefined>()

  const isLoading = specimenLoading || orderLoading

  const testOptions = order?.tests ?? []

  const handleSubmit = async (data: RecordResultRequest) => {
    setSubmitError(undefined)
    try {
      await recordResult(data as RecordResultRequest).unwrap()
      navigate(`/specimens/${specimenId}/results`)
    } catch {
      setSubmitError(t('result:messages.recordError'))
    }
  }

  const apiError = error
    ? ('data' in error ? (error.data as { message?: string })?.message : undefined)
    : submitError

  if (!isLoading && !specimen) {
    return (
      <Alert variant="destructive" appearance="light">
        <AlertIcon><AlertCircle /></AlertIcon>
        <AlertContent><AlertDescription>{t('result:messages.specimenNotFound')}</AlertDescription></AlertContent>
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
          onClick={() => navigate(`/specimens/${specimenId}/results`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t('result:entryTitle')}</h1>
      </div>

      <div className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('result:entryTitle')}</CardTitle>
            {specimen && (
              <CardDescription>
                {t('result:fields.specimen')} : <span className="font-mono">{specimen.barcode}</span>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center gap-2 py-6 text-muted-foreground text-sm">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('common:states.loading')}
              </div>
            ) : (
              <ResultForm
                specimenId={specimenId!}
                testOptions={testOptions}
                onSubmit={(data) => handleSubmit(data as RecordResultRequest)}
                onCancel={() => navigate(`/specimens/${specimenId}/results`)}
                isLoading={isSubmitting}
                error={apiError}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
