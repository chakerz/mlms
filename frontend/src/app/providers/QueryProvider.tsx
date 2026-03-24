import { Provider } from 'react-redux'
import { store } from '@/app/store/store'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
