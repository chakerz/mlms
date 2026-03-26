import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardTable } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { DataTable, Column, TablePagination } from '@/shared/ui/Table'
import { useGetPricingTiersQuery, PricingTierDto } from '@/features/pricing/api/pricingApi'

export function PricingTierListPage() {
  const { t } = useTranslation(['pricing', 'common'])
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useGetPricingTiersQuery({ page, pageSize })

  const columns: Column<PricingTierDto>[] = [
    { key: 'name', header: t('pricing:tier.name'), render: (_, tier) => <span className="font-semibold">{tier.name}</span> },
    { key: 'defaultRate', header: t('pricing:tier.defaultRate'), render: (_, tier) => (
      <span className={`text-sm font-medium ${tier.defaultRate < 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
        {tier.defaultRate > 0 ? '+' : ''}{tier.defaultRate}%
      </span>
    )},
    { key: 'description', header: t('common:labels.description'), render: (_, tier) => <span className="text-sm text-muted-foreground">{tier.description || '–'}</span> },
    { key: 'notes', header: t('pricing:tier.notes'), render: (_, tier) => <span className="text-sm text-muted-foreground">{tier.notes || '–'}</span> },
    { key: 'isActive', header: t('common:labels.status'), render: (_, tier) => (
      <Badge variant={tier.isActive ? 'green' : 'gray'}>{tier.isActive ? t('common:status.active') : t('common:status.inactive')}</Badge>
    )},
    { key: 'actions', header: t('common:labels.actions'), render: (_, tier) => (
      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/pricing-tiers/${tier.id}/edit`) }}>
        {t('common:actions.edit')}
      </Button>
    )},
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('pricing:tier.titleList')}</h1>
        <Button onClick={() => navigate('/pricing-tiers/new')}>
          <Plus className="size-4" />{t('pricing:tier.create')}
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>{t('pricing:tier.titleList')}</CardTitle></CardHeader>
        <CardTable>
          <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(tier) => tier.id} loading={isLoading} onRowClick={(tier) => navigate(`/pricing-tiers/${tier.id}/edit`)} />
        </CardTable>
        <TablePagination page={page} pageSize={pageSize} total={data?.total ?? 0} onPageChange={setPage} />
      </Card>
    </div>
  )
}
