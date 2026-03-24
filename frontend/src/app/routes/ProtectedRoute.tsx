import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/features/auth/model/authSelectors'
import { UserRole } from '@/shared/types/app.types'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { canAccessRoute } from '@/shared/lib/permissions'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !canAccessRoute(user?.role, roles)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
