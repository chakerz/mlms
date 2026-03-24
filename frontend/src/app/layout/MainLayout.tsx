import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useLayout } from '@/app/providers/LayoutProvider'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function MainLayout() {
  const { sidebarCollapsed } = useLayout()

  // Body-Klassen synchronisieren – wie beim Referenz-Dashboard
  useEffect(() => {
    const cls = document.body.classList
    cls.add('mlms', 'sidebar-fixed', 'header-fixed')
    const timer = setTimeout(() => cls.add('layout-initialized'), 500)
    return () => {
      cls.remove('mlms', 'sidebar-fixed', 'header-fixed', 'sidebar-collapse', 'layout-initialized')
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const cls = document.body.classList
    if (sidebarCollapsed) {
      cls.add('sidebar-collapse')
    } else {
      cls.remove('sidebar-collapse')
    }
  }, [sidebarCollapsed])

  return (
    <>
      {/* Desktop Sidebar – wird via CSS positioniert */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Wrapper erhält padding-inline-start von CSS (.mlms.sidebar-fixed .wrapper) */}
      <div className="wrapper flex flex-col min-h-screen bg-muted/30">
        <Header />
        <main className="grow pt-5 px-5 pb-8" role="content">
          <Outlet />
        </main>
      </div>
    </>
  )
}
