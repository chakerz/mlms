import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './QueryProvider'
import { AuthProvider } from './AuthProvider'
import { I18nProvider } from './I18nProvider'
import { LayoutProvider } from './LayoutProvider'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <I18nProvider>
        <BrowserRouter>
          <AuthProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
          </AuthProvider>
        </BrowserRouter>
      </I18nProvider>
    </QueryProvider>
  )
}
