import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card'
import { Modal } from '@/shared/ui/Modal'
import { Input } from '@/shared/ui/Input'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import {
  useGetReportsQuery,
  useGenerateReportMutation,
} from '@/features/report/api/reportApi'
import { formatDateTime } from '@/shared/utils/formatDate'

const STATUS_VARIANT: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'emerald'> = {
  DRAFT: 'yellow',
  VALIDATED: 'blue',
  FINAL: 'emerald',
  CORRECTED: 'orange',
  PUBLISHED: 'green',
}

const STATUS_FILTERS = ['', 'DRAFT', 'VALIDATED', 'FINAL', 'PUBLISHED']

export function ReportValidationQueue() {
  const { t } = useTranslation(['report', 'statuses', 'common'])
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')
  const [orderId, setOrderId] = useState('')
  const generateDialog = useDisclosure()

  const { data, isLoading, isError } = useGetReportsQuery({ status: statusFilter || undefined })
  const [generateReport, { isLoading: isGenerating, error: generateError }] =
    useGenerateReportMutation()

  const handleGenerate = async () => {
    if (!orderId.trim()) return
    try {
      const report = await generateReport({ orderId: orderId.trim() }).unwrap()
      generateDialog.close()
      setOrderId('')
      navigate(`/reports/${report.id}`)
    } catch {
      // error shown via generateError
    }
  }

  if (isLoading) return <PageLoader />
  if (isError) return <Alert variant="error" message={t('common:states.error')} />

  const reports = data?.data ?? []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('report:title')}</h1>
        <Button onClick={generateDialog.open}>
          <Plus className="size-4" />
          {t('report:actions.generate')}
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {s ? t(`statuses:report.${s}`) : 'Tous'}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('report:title')}</CardTitle>
        </CardHeader>
        {reports.length === 0 ? (
          <CardContent>
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t('common:states.empty')}
            </p>
          </CardContent>
        ) : (
          <div className="divide-y divide-border">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => navigate(`/reports/${report.id}`)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={STATUS_VARIANT[report.status] ?? 'gray'}>
                      {t(`statuses:report.${report.status}`)}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      #{report.id.slice(-8)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Commande : <span className="font-mono">{report.orderId.slice(-10)}</span>
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateTime(report.createdAt)}
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Generate report modal */}
      <Modal
        open={generateDialog.isOpen}
        onClose={generateDialog.close}
        title={t('report:generate.title')}
      >
        {generateError && (
          <Alert
            variant="error"
            message={
              'data' in generateError
                ? (generateError.data as { message?: string })?.message ?? t('common:states.error')
                : t('common:states.error')
            }
            className="mb-4"
          />
        )}
        <Input
          label={t('report:generate.orderId')}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Identifiant de la commande..."
          autoFocus
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={generateDialog.close}>
            {t('common:actions.cancel')}
          </Button>
          <Button onClick={handleGenerate} loading={isGenerating} disabled={!orderId.trim()}>
            {t('report:generate.button')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
