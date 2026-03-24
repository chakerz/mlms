import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Edit } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { Alert } from '@/shared/ui/Alert'
import { useGetPatientQuery } from '@/features/patient/api/patientApi'
import { formatDate } from '@/shared/utils/formatDate'

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('patient')
  const navigate = useNavigate()
  const { data: patient, isLoading, isError } = useGetPatientQuery(id!)

  if (isLoading) return <PageLoader />
  if (isError || !patient) return <Alert variant="error" message={t('messages.notFound')} />

  const fields: { label: string; value: string }[] = [
    { label: t('form.lastName'), value: patient.lastName },
    { label: t('form.firstName'), value: patient.firstName },
    { label: t('form.birthDate'), value: formatDate(patient.birthDate) },
    { label: t('form.gender'), value: t(`gender.${patient.gender}`) },
    { label: t('form.phone'), value: patient.phone ?? '–' },
    { label: t('form.email'), value: patient.email ?? '–' },
    { label: t('form.address'), value: patient.address ?? '–' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900">
            {patient.lastName} {patient.firstName}
          </h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/patients/${id}/edit`)}>
          <Edit size={16} className="me-1" />
          {t('actions.edit')}
        </Button>
      </div>
      <Card>
        <div className="p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <dt className="text-sm font-medium text-neutral-500">{field.label}</dt>
                <dd className="mt-1 text-sm text-neutral-900">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Card>
    </div>
  )
}
