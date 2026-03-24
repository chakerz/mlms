import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DataTable, Column } from '@/shared/ui/Table'
import { TablePagination } from '@/shared/ui/Table'
import { PatientDto } from '@/features/patient/api/patientApi'
import { formatDate, formatDateTime } from '@/shared/utils/formatDate'

interface PatientTableProps {
  patients: PatientDto[]
  total: number
  page: number
  pageSize: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

export function PatientTable({ patients, total, page, pageSize, isLoading, onPageChange }: PatientTableProps) {
  const { t } = useTranslation('patient')
  const navigate = useNavigate()

  const columns: Column<PatientDto>[] = [
    {
      key: 'lastName',
      header: t('form.lastName'),
      render: (_, p) => <span className="font-medium">{p.lastName}</span>,
    },
    {
      key: 'firstName',
      header: t('form.firstName'),
    },
    {
      key: 'birthDate',
      header: t('form.birthDate'),
      render: (_, p) => formatDate(p.birthDate),
    },
    {
      key: 'gender',
      header: t('form.gender'),
      render: (_, p) => t(`gender.${p.gender}`),
    },
    {
      key: 'phone',
      header: t('form.phone'),
      render: (_, p) => p.phone ?? '–',
    },
    {
      key: 'createdAt',
      header: t('form.createdAt'),
      render: (_, p) => <span className="text-xs text-muted-foreground">{formatDateTime(p.createdAt)}</span>,
    },
  ]

  return (
    <div>
      <DataTable
        columns={columns}
        data={patients}
        keyExtractor={(p) => p.id}
        loading={isLoading}
        onRowClick={(p) => navigate(`/patients/${p.id}`)}
      />
      <div className="mt-4">
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
