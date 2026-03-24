import { AuthUser } from '@/shared/types/app.types'

interface StateWithAuth {
  auth: {
    token: string | null
    user: AuthUser | null
    isAuthenticated: boolean
  }
}

export const selectToken = (state: StateWithAuth) => state.auth.token
export const selectCurrentUser = (state: StateWithAuth) => state.auth.user
export const selectIsAuthenticated = (state: StateWithAuth) => state.auth.isAuthenticated
