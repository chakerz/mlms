import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { LogOut, Menu } from 'lucide-react'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { logout } from '@/features/auth/model/authSlice'
import { LanguageSwitcher } from '@/features/auth/components/LanguageSwitcher'
import { Button } from '@/shared/ui/Button'
import { Avatar, AvatarFallback } from '@/shared/ui/shadcn/avatar'
import { Separator } from '@/shared/ui/shadcn/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'
import { cn } from '@/shared/utils/cn'
import { Sidebar } from './Sidebar'

export function Header() {
  const dispatch = useDispatch()
  const { t } = useTranslation('common')
  const user = useSelector(selectCurrentUser)
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => dispatch(logout())
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <>
      <header
        className={cn(
          'header fixed top-0 z-10 start-0 end-0',
          'flex items-stretch shrink-0 bg-background',
          'border-b border-transparent transition-[border-color,box-shadow]',
          scrolled && 'border-border shadow-xs',
        )}
      >
        <div className="flex w-full items-center px-4 lg:px-6 gap-3">
          {/* Mobile: Sidebar-Toggle */}
          <button
            className="flex lg:hidden items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Breadcrumb */}
          <PageTitle />

          {/* Rechte Seite */}
          <div className="flex items-center gap-2 ms-auto">
            <LanguageSwitcher />
            <Separator orientation="vertical" className="h-5 mx-0.5" />
            {user && (
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden md:block max-w-[160px] truncate">
                  {user.email}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t('actions.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar (Dialog) */}
      <Dialog open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <DialogContent
          className="p-0 gap-0 max-w-[280px] h-full rounded-none data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full"
          style={{ position: 'fixed', left: 0, top: 0, bottom: 0, transform: 'none', margin: 0 }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Navigation</DialogTitle>
          </DialogHeader>
          <Sidebar />
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── PageTitle ───────────────────────────────────────────────────────────────

function PageTitle() {
  const { t } = useTranslation('common')
  const location = useLocation()

  const segment = location.pathname.split('/').filter(Boolean)[0] ?? 'dashboard'
  // Sonderbehandlung für Routen mit camelCase (test-definitions → testDefinitions)
  const camel = segment.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
  const label = t(`navigation.${camel}`, { defaultValue: t(`navigation.${segment}`, { defaultValue: '' }) })

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
      <span className="text-xs font-medium text-muted-foreground hidden lg:block shrink-0">MLMS</span>
      <span className="text-muted-foreground hidden lg:block shrink-0">/</span>
      {label && (
        <span className="text-sm font-semibold text-foreground truncate">{label}</span>
      )}
    </div>
  )
}
