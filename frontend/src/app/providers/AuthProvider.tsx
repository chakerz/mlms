import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { setCurrentUser, logout } from '@/features/auth/model/authSlice'
import { selectToken } from '@/features/auth/model/authSelectors'
import { useSelector } from 'react-redux'
import { PageLoader } from '@/shared/ui/Loader'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const { data, isLoading, isError } = useGetMeQuery(undefined, { skip: !token })

  useEffect(() => {
    if (data) {
      dispatch(setCurrentUser(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    if (isError) {
      dispatch(logout())
    }
  }, [isError, dispatch])

  if (token && isLoading) return <PageLoader />

  return <>{children}</>
}
