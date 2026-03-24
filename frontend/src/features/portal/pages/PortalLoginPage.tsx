import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectCurrentUser } from '@/features/auth/model/authSelectors'
import { UserRole } from '@/shared/types/app.types'

// The portal uses the shared login page (/login).
// If a PATIENT user lands here already authenticated, redirect them to the portal.
export function PortalLoginPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user?.role === UserRole.PATIENT) {
      navigate('/portal/reports', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  return null
}
