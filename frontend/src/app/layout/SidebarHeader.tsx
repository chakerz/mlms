import { ChevronFirst } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLayout } from '@/app/providers/LayoutProvider'
import { cn } from '@/shared/utils/cn'

export function SidebarHeader() {
  const { sidebarCollapsed, toggleSidebar } = useLayout()

  return (
    <div className="sidebar-header hidden lg:flex items-center relative justify-between px-4 lg:px-5 shrink-0">
      <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
        {/* Full logo – ausgeblendet im collapse-State via CSS (.sidebar-logo-full) */}
        <span className="sidebar-logo-full flex items-center gap-2 min-w-0">
          <span className="size-7 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-xs">ML</span>
          </span>
          <span className="font-bold text-sm text-foreground truncate">MLMS</span>
        </span>
        {/* Mini logo – sichtbar nur im collapse-State via CSS (.sidebar-logo-mini) */}
        <span className="sidebar-logo-mini hidden items-center justify-center">
          <span className="size-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">ML</span>
          </span>
        </span>
      </Link>

      <button
        onClick={toggleSidebar}
        className={cn(
          'size-6 absolute start-full top-1/2 -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2',
          'rounded-full border border-border bg-background shadow-sm',
          'flex items-center justify-center text-muted-foreground hover:text-foreground',
          'transition-transform',
          sidebarCollapsed ? 'ltr:rotate-180' : 'rtl:rotate-180',
        )}
        aria-label="Toggle sidebar"
      >
        <ChevronFirst className="size-3.5" />
      </button>
    </div>
  )
}
