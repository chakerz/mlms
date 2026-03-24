import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardToolbar, CardTable } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useListNonConformitesQuery, NonConformiteDto } from '../api/nonConformiteApi'
import { formatDateTime } from '@/shared/utils/formatDate'

const ACTION_VARIANT: Record<string, 'green' | 'yellow' | 'red'> = {
  ACCEPTE:             'green',
  ACCEPTE_SOUS_RESERVE: 'yellow',
  REFUSE:              'red',
}

export function NonConformiteListPage() {
  const { t } = useTranslation('nonConformite')
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useListNonConformitesQuery({ page, pageSize })

  const columns: Column<NonConformiteDto>[] = [
    {
      key: 'reason',
      header: t('form.reason'),
      render: (_, nc) => <span className="text-sm font-medium">{t(`reason.${nc.reason}`)}</span>,
    },
    {
      key: 'action',
      header: t('form.action'),
      render: (_, nc) => (
        <Badge variant={ACTION_VARIANT[nc.action] ?? 'gray'}>
          {t(`action.${nc.action}`)}
        </Badge>
      ),
    },
    {
      key: 'specimenId',
      header: t('form.specimenId'),
      render: (_, nc) =>
        nc.specimenId ? (
          <span className="font-mono text-xs text-muted-foreground">#{nc.specimenId.slice(-8)}</span>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        ),
    },
    {
      key: 'createdAt',
      header: t('form.createdAt'),
      render: (_, nc) => <span className="text-xs text-muted-foreground">{formatDateTime(nc.createdAt)}</span>,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('title')}</h1>
        <Button onClick={() => navigate('/non-conformites/new')}>
          <Plus className="size-4" />
          {t('actions.create')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardTable>
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(nc) => nc.id}
            loading={isLoading}
            onRowClick={(nc) => navigate(`/non-conformites/${nc.id}`)}
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
