import { cn } from '@/shared/utils/cn'
import { SidebarHeader } from './SidebarHeader'
import { SidebarMenu } from './SidebarMenu'

export function Sidebar() {
  return (
    <div
      className={cn(
        'sidebar',
        'bg-background border-e border-border',
        'lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex flex-col items-stretch shrink-0',
      )}
    >
      <SidebarHeader />
      <div className="overflow-hidden flex flex-col flex-1">
        <div className="w-(--sidebar-default-width) flex flex-col flex-1">
          <SidebarMenu />
        </div>
      </div>
    </div>
  )
}
