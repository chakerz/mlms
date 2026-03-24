import { UserRole } from '@/shared/types/app.types'

export function hasRole(userRole: string | undefined, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole as UserRole)
}

export function canAccessRoute(
  userRole: string | undefined,
  routeRoles: UserRole[] | undefined,
): boolean {
  if (!routeRoles) return true
  return hasRole(userRole, routeRoles)
}
