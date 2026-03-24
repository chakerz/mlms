import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { PatientForm, PatientFormValues } from '@/features/patient/components/PatientForm'
import { useCreatePatientMutation } from '@/features/patient/api/patientApi'

export function PatientCreatePage() {
  const { t } = useTranslation('patient')
  const navigate = useNavigate()
  const [createPatient, { isLoading, error }] = useCreatePatientMutation()

  const handleSubmit = async (data: PatientFormValues) => {
    try {
      const patient = await createPatient(data).unwrap()
      navigate(`/patients/${patient.id}`)
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">{t('title.create')}</h1>
      </div>
      <Card>
        <div className="p-6">
          {errorMessage && <Alert variant="error" message={errorMessage} className="mb-4" />}
          <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  )
}
