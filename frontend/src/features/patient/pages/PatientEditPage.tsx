import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { PageLoader } from '@/shared/ui/Loader'
import { PatientForm, PatientFormValues } from '@/features/patient/components/PatientForm'
import { useGetPatientQuery, useUpdatePatientMutation } from '@/features/patient/api/patientApi'

export function PatientEditPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('patient')
  const navigate = useNavigate()

  const { data: patient, isLoading } = useGetPatientQuery(id!)
  const [updatePatient, { isLoading: isUpdating, error }] = useUpdatePatientMutation()

  if (isLoading) return <PageLoader />
  if (!patient) return <Alert variant="error" message={t('messages.notFound')} />

  const handleSubmit = async (data: PatientFormValues) => {
    try {
      await updatePatient({ id: id!, ...data }).unwrap()
      navigate(`/patients/${id}`)
    } catch {
      // error handled via RTK Query state
    }
  }

  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message ?? t('messages.updateError')
      : t('messages.updateError')
    : undefined

  // Convert ISO birthDate to YYYY-MM-DD for the date input
  const defaultBirthDate = patient.birthDate ? patient.birthDate.slice(0, 10) : ''

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${id}`)}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('title.edit')}</h1>
      </div>
      <Card>
        <div className="p-6">
          {errorMessage && <Alert variant="error" message={errorMessage} className="mb-4" />}
          <PatientForm
            defaultValues={{
              firstName: patient.firstName,
              lastName: patient.lastName,
              birthDate: defaultBirthDate,
              gender: patient.gender as 'M' | 'F' | 'O',
              phone: patient.phone ?? '',
              email: patient.email ?? '',
              address: patient.address ?? '',
            }}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </div>
      </Card>
    </div>
  )
}
