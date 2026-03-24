import { JSX, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, ClipboardList, FlaskConical,
  TestTube, FileText, Package, BarChart2, UserCog, BookOpen,
  AlertTriangle, Globe,
  type LucideIcon,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { canAccessRoute } from '@/shared/lib/permissions'
import { NAV_ROUTES } from '@/app/routes/route-config'
import { UserRole } from '@/shared/types/app.types'
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  type AccordionMenuClassNames,
} from '@/shared/ui/shadcn/accordion-menu'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Users, ClipboardList, FlaskConical,
  TestTube, FileText, Package, BarChart2, UserCog, BookOpen,
  AlertTriangle, Globe,
}

// Nav-Gruppen für die Sidebar
interface NavGroup {
  labelKey?: string
  items: (typeof NAV_ROUTES)[number][]
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { path: '/dashboard', labelKey: 'navigation.dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    labelKey: 'navigation.groups.preAnalytique',
    items: [
      { path: '/patients', labelKey: 'navigation.patients', icon: 'Users', roles: [UserRole.ADMIN, UserRole.RECEPTION, UserRole.PHYSICIAN, UserRole.TECHNICIAN] },
      { path: '/orders', labelKey: 'navigation.orders', icon: 'ClipboardList', roles: [UserRole.ADMIN, UserRole.RECEPTION, UserRole.PHYSICIAN, UserRole.TECHNICIAN] },
      { path: '/specimens', labelKey: 'navigation.specimens', icon: 'FlaskConical', roles: [UserRole.ADMIN, UserRole.TECHNICIAN] },
    ],
  },
  {
    labelKey: 'navigation.groups.analytique',
    items: [
      { path: '/results', labelKey: 'navigation.results', icon: 'TestTube', roles: [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN] },
      { path: '/non-conformites', labelKey: 'navigation.nonConformites', icon: 'AlertTriangle', roles: [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.RECEPTION] },
    ],
  },
  {
    labelKey: 'navigation.groups.postAnalytique',
    items: [
      { path: '/reports', labelKey: 'navigation.reports', icon: 'FileText', roles: [UserRole.ADMIN, UserRole.PHYSICIAN] },
      { path: '/test-definitions', labelKey: 'navigation.testDefinitions', icon: 'BookOpen', roles: [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.RECEPTION] },
    ],
  },
  {
    labelKey: 'navigation.groups.stock',
    items: [
      { path: '/reagents', labelKey: 'navigation.reagents', icon: 'Package', roles: [UserRole.ADMIN, UserRole.TECHNICIAN] },
      { path: '/inventory', labelKey: 'navigation.inventory', icon: 'BarChart2', roles: [UserRole.ADMIN, UserRole.TECHNICIAN] },
    ],
  },
  {
    labelKey: 'navigation.groups.administration',
    items: [
      { path: '/users', labelKey: 'navigation.users', icon: 'UserCog', roles: [UserRole.ADMIN] },
    ],
  },
  {
    labelKey: 'navigation.groups.portal',
    items: [
      { path: '/portal', labelKey: 'navigation.portal', icon: 'Globe', roles: [UserRole.PATIENT] },
    ],
  },
]

const classNames: AccordionMenuClassNames = {
  root: 'space-y-1',
  group: 'gap-px',
  label: 'uppercase text-[10px] font-semibold tracking-wider text-muted-foreground/60 pt-3 pb-0.5 px-2',
  item: 'h-9 rounded-lg hover:bg-transparent text-muted-foreground hover:text-foreground data-[selected=true]:text-primary data-[selected=true]:bg-primary/8 data-[selected=true]:font-medium',
}

export function SidebarMenu() {
  const { t } = useTranslation('common')
  const location = useLocation()
  const user = useSelector(selectCurrentUser)

  const matchPath = useCallback(
    (path: string): boolean =>
      path === location.pathname || (path.length > 1 && location.pathname.startsWith(path)),
    [location.pathname],
  )

  const buildItem = (route: (typeof NAV_ROUTES)[number]): JSX.Element | null => {
    if (!canAccessRoute(user?.role, route.roles as UserRole[] | undefined)) return null
    const Icon = ICONS[route.icon]
    return (
      <AccordionMenuItem key={route.path} value={route.path} className="text-sm font-medium">
        <Link to={route.path} className="flex items-center gap-2.5 grow">
          {Icon && <Icon data-slot="accordion-menu-icon" className="size-4 shrink-0" />}
          <span data-slot="accordion-menu-title" className="truncate">{t(route.labelKey)}</span>
        </Link>
      </AccordionMenuItem>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="py-4 px-3 lg:max-h-[calc(100vh-var(--header-height,64px))]">
        <AccordionMenu
          selectedValue={location.pathname}
          matchPath={matchPath}
          type="single"
          collapsible
          classNames={classNames}
        >
          {NAV_GROUPS.map((group, gi) => {
            const visibleItems = group.items
              .map((item) => buildItem(item))
              .filter(Boolean) as JSX.Element[]

            if (visibleItems.length === 0) return null

            return (
              <AccordionMenuGroup key={gi}>
                {group.labelKey && (
                  <AccordionMenuLabel>{t(group.labelKey, { defaultValue: group.labelKey })}</AccordionMenuLabel>
                )}
                {visibleItems}
              </AccordionMenuGroup>
            )
          })}
        </AccordionMenu>
      </div>
    </ScrollArea>
  )
}
