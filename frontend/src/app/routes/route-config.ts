import { UserRole } from '@/shared/types/app.types'

export interface RouteConfig {
  path: string
  labelKey: string
  icon: string
  roles?: UserRole[]
}

export const NAV_ROUTES: RouteConfig[] = [
  {
    path: '/dashboard',
    labelKey: 'navigation.dashboard',
    icon: 'LayoutDashboard',
  },
  {
    path: '/patients',
    labelKey: 'navigation.patients',
    icon: 'Users',
    roles: [UserRole.ADMIN, UserRole.RECEPTION, UserRole.PHYSICIAN, UserRole.TECHNICIAN],
  },
  {
    path: '/orders',
    labelKey: 'navigation.orders',
    icon: 'ClipboardList',
    roles: [UserRole.ADMIN, UserRole.RECEPTION, UserRole.PHYSICIAN, UserRole.TECHNICIAN],
  },
  {
    path: '/specimens',
    labelKey: 'navigation.specimens',
    icon: 'FlaskConical',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN],
  },
  {
    path: '/results',
    labelKey: 'navigation.results',
    icon: 'TestTube',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN],
  },
  {
    path: '/reports',
    labelKey: 'navigation.reports',
    icon: 'FileText',
    roles: [UserRole.ADMIN, UserRole.PHYSICIAN],
  },
  {
    path: '/reagents',
    labelKey: 'navigation.reagents',
    icon: 'Package',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN],
  },
  {
    path: '/inventory',
    labelKey: 'navigation.inventory',
    icon: 'BarChart2',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN],
  },
  {
    path: '/portal',
    labelKey: 'navigation.portal',
    icon: 'Globe',
    roles: [UserRole.PATIENT],
  },
  {
    path: '/test-definitions',
    labelKey: 'navigation.testDefinitions',
    icon: 'BookOpen',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.RECEPTION],
  },
  {
    path: '/non-conformites',
    labelKey: 'navigation.nonConformites',
    icon: 'AlertTriangle',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.RECEPTION],
  },
  {
    path: '/practitioners',
    labelKey: 'navigation.practitioners',
    icon: 'Stethoscope',
    roles: [UserRole.ADMIN, UserRole.RECEPTION],
  },
  {
    path: '/invoices',
    labelKey: 'navigation.invoices',
    icon: 'Receipt',
    roles: [UserRole.ADMIN, UserRole.RECEPTION],
  },
  {
    path: '/payments',
    labelKey: 'navigation.payments',
    icon: 'CreditCard',
    roles: [UserRole.ADMIN, UserRole.RECEPTION],
  },
  {
    path: '/users',
    labelKey: 'navigation.users',
    icon: 'UserCog',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/instruments',
    labelKey: 'navigation.instruments',
    icon: 'Cpu',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN],
  },
  {
    path: '/instruments/outbox',
    labelKey: 'navigation.instrumentOutbox',
    icon: 'Send',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN],
  },
  {
    path: '/instruments/inbox',
    labelKey: 'navigation.instrumentInbox',
    icon: 'Inbox',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN],
  },
  {
    path: '/instruments/raw-results',
    labelKey: 'navigation.instrumentRawResults',
    icon: 'Database',
    roles: [UserRole.ADMIN, UserRole.TECHNICIAN],
  },
]
