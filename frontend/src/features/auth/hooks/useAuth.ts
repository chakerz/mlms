import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { loginSuccess } from '@/features/auth/model/authSlice'
import i18n from '@/i18n'

export function useAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginMutation, { isLoading, error }] = useLoginMutation()

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await loginMutation(credentials).unwrap()
      dispatch(loginSuccess({ token: result.accessToken, user: result.user }))
      i18n.changeLanguage(result.user.language.toLowerCase())
      navigate(result.user.role === 'PATIENT' ? '/portal/reports' : '/dashboard')
    } catch {
      // error is handled via RTK Query error state
    }
  }

  const errorMessage = error
    ? 'status' in error
      ? (error.data as { message?: string })?.message ?? 'Erreur de connexion'
      : 'Erreur de connexion'
    : undefined

  return { login, isLoading, error: errorMessage }
}
