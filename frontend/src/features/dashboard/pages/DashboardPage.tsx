import { useTranslation } from 'react-i18next'
import {
  Users, ClipboardList, FileText, Package,
  FlaskConical, AlertTriangle, TrendingUp, ArrowUp, ArrowDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { useGetPatientsQuery } from '@/features/patient/api/patientApi'
import { useGetOrdersQuery } from '@/features/order/api/orderApi'
import { useGetReportsQuery } from '@/features/report/api/reportApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/utils/cn'

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  iconClass: string
  trend?: { value: number; up: boolean }
  href?: string
}

function StatCard({ label, value, icon: Icon, iconClass, trend, href }: StatCardProps) {
  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {trend && (
              <span className={cn('flex items-center gap-1 text-xs font-medium', trend.up ? 'text-success' : 'text-destructive')}>
                {trend.up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          <div className={cn('p-2.5 rounded-lg shrink-0', iconClass)}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) return <Link to={href} className="block">{content}</Link>
  return content
}

// ─── Recent Orders ────────────────────────────────────────────────────────────

const ORDER_STATUS_VARIANT: Record<string, 'default' | 'warning' | 'success' | 'danger' | 'info' | 'secondary'> = {
  PENDING: 'warning',
  VALIDATED: 'success',
  IN_PROGRESS: 'info',
  CANCELLED: 'danger',
  COMPLETED: 'success',
}

function RecentOrders() {
  const { t } = useTranslation(['dashboard', 'order', 'common'])
  const { data, isLoading } = useGetOrdersQuery({ page: 1, pageSize: 5 })
  const orders = data?.data ?? []

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="text-sm font-semibold">{t('dashboard:sections.recentOrders')}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/orders">{t('common:actions.seeAll')}</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-10">{t('common:states.empty')}</p>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {order.patientId}
                  </span>
                </div>
                <Badge variant={ORDER_STATUS_VARIANT[order.status] ?? 'secondary'}>
                  {t(`order:statuses.${order.status}`, { defaultValue: order.status })}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

function QuickActions() {
  const { t } = useTranslation(['dashboard', 'common'])

  const actions = [
    { labelKey: 'dashboard:actions.newPatient', href: '/patients/new', icon: Users, colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
    { labelKey: 'dashboard:actions.newOrder', href: '/orders/new', icon: ClipboardList, colorClass: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400' },
    { labelKey: 'dashboard:actions.viewReports', href: '/reports', icon: FileText, colorClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
    { labelKey: 'dashboard:actions.checkStock', href: '/inventory', icon: Package, colorClass: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400' },
  ]

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-sm font-semibold">{t('dashboard:sections.quickActions')}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                to={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-center group"
              >
                <div className={cn('p-2 rounded-lg', action.colorClass)}>
                  <Icon className="size-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                  {t(action.labelKey, { defaultValue: action.labelKey })}
                </span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common'])
  const user = useSelector(selectCurrentUser)

  const { data: patientsData } = useGetPatientsQuery({ page: 1, pageSize: 1 })
  const { data: ordersData } = useGetOrdersQuery({ page: 1, pageSize: 1 })
  const { data: reportsData } = useGetReportsQuery({ page: 1, status: 'DRAFT' })

  const stats: StatCardProps[] = [
    {
      label: t('dashboard:cards.patients'),
      value: patientsData?.total ?? '–',
      icon: Users,
      iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
      href: '/patients',
    },
    {
      label: t('dashboard:cards.orders'),
      value: ordersData?.total ?? '–',
      icon: ClipboardList,
      iconClass: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
      href: '/orders',
    },
    {
      label: t('dashboard:cards.reportsPending'),
      value: reportsData?.meta?.total ?? '–',
      icon: FileText,
      iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
      href: '/reports',
    },
    {
      label: t('dashboard:cards.lowStock'),
      value: '–',
      icon: Package,
      iconClass: 'bg-orange-50 text-orange-500 dark:bg-orange-950 dark:text-orange-400',
      href: '/inventory',
    },
  ]

  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? t('dashboard:greeting.morning')
      : hour < 18
        ? t('dashboard:greeting.afternoon')
        : t('dashboard:greeting.evening')

  return (
    <div className="flex flex-col gap-6">
      {/* Begrüßung */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-bold text-foreground">
          {greeting}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-sm text-muted-foreground">{t('dashboard:subtitle')}</p>
      </div>

      {/* Stat-Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Haupt-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Linke Spalte: Aktivitäts-Karten */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <RecentOrders />
        </div>

        {/* Rechte Spalte: Quick Actions + Summary */}
        <div className="flex flex-col gap-4">
          <QuickActions />

          {/* Kennzahlen-Karte */}
          <Card>
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                {t('dashboard:sections.overview')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                {[
                  { label: t('dashboard:cards.specimens'), icon: FlaskConical, href: '/specimens', colorClass: 'text-cyan-600' },
                  { label: t('dashboard:cards.nonConformites'), icon: AlertTriangle, href: '/non-conformites', colorClass: 'text-amber-600' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <Icon className={cn('size-4 shrink-0', item.colorClass)} />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
