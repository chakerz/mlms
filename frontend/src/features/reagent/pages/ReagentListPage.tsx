import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { TablePagination } from '@/shared/ui/Table'
import { useGetReagentsQuery } from '../api/reagentApi'
import { ReagentTable } from '../components/ReagentTable'

export function ReagentListPage() {
  const { t } = useTranslation('reagent')
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetReagentsQuery({ page, pageSize })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('title')}</h1>
        <Button onClick={() => navigate('/reagents/new')}>
          <Plus className="size-4" />
          {t('actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardTable>
          <ReagentTable data={data?.data ?? []} loading={isLoading} />
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
