import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthUser } from '@/shared/types/app.types'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
}

const TOKEN_KEY = 'mlms_token'

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      localStorage.setItem(TOKEN_KEY, action.payload.token)
    },
    setCurrentUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout(state) {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem(TOKEN_KEY)
    },
  },
})

export const { loginSuccess, setCurrentUser, logout } = authSlice.actions
export default authSlice.reducer
