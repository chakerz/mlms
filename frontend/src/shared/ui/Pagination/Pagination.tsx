import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/ui/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/shadcn/select'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  sizes?: number[]
  className?: string
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  sizes = [10, 20, 25, 50, 100],
  className,
}: PaginationProps) {
  const { t } = useTranslation('common')

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const moreLimit = 5
  const currentGroupStart = Math.floor((page - 1) / moreLimit) * moreLimit
  const currentGroupEnd = Math.min(currentGroupStart + moreLimit, pageCount)

  const btnBase = 'size-7 p-0 text-sm'

  const pageButtons = []
  for (let i = currentGroupStart; i < currentGroupEnd; i++) {
    const p = i + 1
    pageButtons.push(
      <Button
        key={p}
        size="sm"
        mode="icon"
        variant="ghost"
        className={cn(btnBase, 'text-muted-foreground', page === p && 'bg-accent text-accent-foreground')}
        onClick={() => onPageChange(p)}
      >
        {p}
      </Button>,
    )
  }

  return (
    <div
      className={cn(
        'flex flex-wrap flex-col sm:flex-row justify-between items-center gap-2.5 px-4 py-3 border-t border-border',
        className,
      )}
    >
      {/* Left: rows per page */}
      <div className="flex items-center gap-2.5 order-2 sm:order-1">
        <span className="text-sm text-muted-foreground">{t('table.rowsPerPage')}</span>
        {onPageSizeChange && (
          <Select
            value={`${pageSize}`}
            indicatorPosition="right"
            onValueChange={(v) => { onPageSizeChange(Number(v)); onPageChange(1) }}
          >
            <SelectTrigger className="w-fit" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[50px]">
              {sizes.map((s) => (
                <SelectItem key={s} value={`${s}`}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Right: info + page buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 order-1 sm:order-2">
        <span className="text-sm text-muted-foreground text-nowrap order-2 sm:order-1">
          {t('pagination.showing', { from, to, total })}
        </span>
        {pageCount > 1 && (
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button
              size="sm"
              mode="icon"
              variant="ghost"
              className={btnBase}
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <span className="sr-only">Page précédente</span>
              <ChevronLeftIcon className="size-4" />
            </Button>

            {currentGroupStart > 0 && (
              <Button size="sm" mode="icon" variant="ghost" className={btnBase}
                onClick={() => onPageChange(currentGroupStart)}>
                ...
              </Button>
            )}

            {pageButtons}

            {currentGroupEnd < pageCount && (
              <Button size="sm" mode="icon" variant="ghost" className={btnBase}
                onClick={() => onPageChange(currentGroupEnd + 1)}>
                ...
              </Button>
            )}

            <Button
              size="sm"
              mode="icon"
              variant="ghost"
              className={btnBase}
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pageCount}
            >
              <span className="sr-only">Page suivante</span>
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
