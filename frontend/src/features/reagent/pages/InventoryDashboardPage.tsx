import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { PageLoader } from '@/shared/ui/Loader'
import { useGetReagentsQuery } from '../api/reagentApi'

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function InventoryDashboardPage() {
  const { t } = useTranslation('reagent')
  const navigate = useNavigate()
  const { data, isLoading } = useGetReagentsQuery({ page: 1, pageSize: 100 })

  const reagents = data?.data ?? []
  const total = data?.total ?? 0

  if (isLoading) return <PageLoader />

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('inventoryTitle')}</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/reagents')}>
            {t('actions.viewAll')}
          </Button>
          <Button onClick={() => navigate('/reagents/new')}>
            {t('actions.create')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="size-5 text-blue-600" />}
          label={t('stats.totalReagents')}
          value={total}
          color="bg-blue-50"
        />
        <StatCard
          icon={<CheckCircle className="size-5 text-green-600" />}
          label={t('stats.activeCategories')}
          value={new Set(reagents.map((r) => r.category)).size}
          color="bg-green-50"
        />
        <StatCard
          icon={<AlertTriangle className="size-5 text-orange-600" />}
          label={t('stats.manufacturers')}
          value={new Set(reagents.map((r) => r.manufacturer)).size}
          color="bg-orange-50"
        />
        <StatCard
          icon={<Clock className="size-5 text-purple-600" />}
          label={t('stats.withTempRequired')}
          value={reagents.filter((r) => r.storageTemp).length}
          color="bg-purple-50"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('stats.byCategory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['CHEMISTRY', 'HEMATOLOGY', 'IMMUNOLOGY', 'MICROBIOLOGY'].map((cat) => {
              const count = reagents.filter((r) => r.category === cat).length
              return (
                <div key={cat} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{cat}</span>
                  <span className="text-sm font-medium text-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
