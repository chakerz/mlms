import { useTranslation } from 'react-i18next'
import { DataTable, Column } from '@/shared/ui/Table'
import { Badge } from '@/shared/ui/Badge'
import { ReagentLotDto } from '../api/reagentApi'
import { formatDate } from '@/shared/utils/formatDate'

const LOW_STOCK_THRESHOLD = 10

interface Props {
  data: ReagentLotDto[]
  loading?: boolean
}

export function ReagentLotTable({ data, loading }: Props) {
  const { t } = useTranslation(['reagent', 'common'])

  const columns: Column<ReagentLotDto>[] = [
    {
      key: 'lotNumber',
      header: t('fields.lotNumber'),
      render: (_, l) => <span className="font-mono text-sm">{l.lotNumber}</span>,
    },
    {
      key: 'expiryDate',
      header: t('fields.expiryDate'),
      render: (_, l) => (
        <span className={l.isExpired ? 'text-red-600 font-medium' : undefined}>
          {formatDate(l.expiryDate)}
        </span>
      ),
    },
    {
      key: 'currentQuantity',
      header: t('fields.currentQuantity'),
      render: (_, l) => (
        <span className={l.currentQuantity <= LOW_STOCK_THRESHOLD ? 'text-orange-600 font-medium' : undefined}>
          {l.currentQuantity}
        </span>
      ),
    },
    {
      key: 'initialQuantity',
      header: t('fields.initialQuantity'),
      render: (_, l) => l.initialQuantity,
    },
    {
      key: 'storageLocation',
      header: t('fields.storageLocation'),
      render: (_, l) => l.storageLocation ?? '—',
    },
    {
      key: 'status',
      header: t('common:labels.status'),
      render: (_, l) => {
        if (l.isBlocked) return <Badge variant="red">{t('status.blocked')}</Badge>
        if (l.isExpired) return <Badge variant="red">{t('status.expired')}</Badge>
        if (l.currentQuantity <= LOW_STOCK_THRESHOLD) return <Badge variant="orange">{t('status.lowStock')}</Badge>
        return <Badge variant="green">{t('status.available')}</Badge>
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(l) => l.id}
      loading={loading}
    />
  )
}
