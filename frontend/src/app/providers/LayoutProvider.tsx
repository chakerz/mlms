import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface LayoutContextValue {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const LayoutContext = createContext<LayoutContextValue>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
})

const STORAGE_KEY = 'mlms_sidebar_collapsed'

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {}
      return next
    })
  }, [])

  const value = useMemo(() => ({ sidebarCollapsed, toggleSidebar }), [sidebarCollapsed, toggleSidebar])

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  return useContext(LayoutContext)
}
