import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetPractitionersQuery, PractitionerDto } from '@/features/practitioner/api/practitionerApi'

export function PractitionerListPage() {
  const { t } = useTranslation(['practitioner', 'common'])
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetPractitionersQuery({ page, pageSize })

  const columns: Column<PractitionerDto>[] = [
    {
      key: 'fullName',
      header: t('practitioner:form.fullName'),
      render: (_, p) => (
        <span className="font-semibold text-secondary-foreground">{p.fullName}</span>
      ),
    },
    {
      key: 'email',
      header: t('common:labels.email'),
      render: (_, p) => (
        <span className="text-sm text-muted-foreground">{p.email}</span>
      ),
    },
    {
      key: 'phoneNumber',
      header: t('common:labels.phone'),
      render: (_, p) => (
        <span className="text-sm text-muted-foreground">{p.phoneNumber ?? '–'}</span>
      ),
    },
    {
      key: 'speciality',
      header: t('practitioner:form.speciality'),
      render: (_, p) => (
        <span className="text-sm text-secondary-foreground">{p.speciality ?? '–'}</span>
      ),
    },
    {
      key: 'isActive',
      header: t('common:labels.status'),
      render: (_, p) => (
        <Badge variant={p.isActive ? 'green' : 'gray'}>
          {p.isActive ? t('practitioner:status.active') : t('practitioner:status.inactive')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: t('common:labels.actions'),
      render: (_, p) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/practitioners/${p.id}/edit`)
            }}
          >
            {t('common:actions.edit')}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('practitioner:title.list')}</h1>
        <Button onClick={() => navigate('/practitioners/new')}>
          <Plus className="size-4" />
          {t('practitioner:actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('practitioner:title.list')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(p) => p.id}
            loading={isLoading}
            onRowClick={(p) => navigate(`/practitioners/${p.id}/edit`)}
          />
        </CardTable>
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>
    </div>
  )
}
