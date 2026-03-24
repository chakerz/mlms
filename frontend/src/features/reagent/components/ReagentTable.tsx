import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DataTable, Column } from '@/shared/ui/Table'
import { Badge } from '@/shared/ui/Badge'
import { ReagentDto } from '../api/reagentApi'

const CATEGORY_VARIANT: Record<string, 'blue' | 'green' | 'yellow' | 'orange'> = {
  CHEMISTRY: 'blue',
  HEMATOLOGY: 'red' as 'orange',
  IMMUNOLOGY: 'green',
  MICROBIOLOGY: 'yellow',
}

interface Props {
  data: ReagentDto[]
  loading?: boolean
}

export function ReagentTable({ data, loading }: Props) {
  const { t } = useTranslation('reagent')
  const navigate = useNavigate()

  const columns: Column<ReagentDto>[] = [
    {
      key: 'name',
      header: t('fields.name'),
      render: (_, r) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: 'manufacturer',
      header: t('fields.manufacturer'),
      render: (_, r) => r.manufacturer,
    },
    {
      key: 'category',
      header: t('fields.category'),
      render: (_, r) => (
        <Badge variant={CATEGORY_VARIANT[r.category] ?? 'gray'}>{r.category}</Badge>
      ),
    },
    {
      key: 'catalogNumber',
      header: t('fields.catalogNumber'),
      render: (_, r) => r.catalogNumber ?? '—',
    },
    {
      key: 'storageTemp',
      header: t('fields.storageTemp'),
      render: (_, r) => r.storageTemp ?? '—',
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(r) => r.id}
      loading={loading}
      onRowClick={(r) => navigate(`/reagents/${r.id}/lots`)}
    />
  )
}
