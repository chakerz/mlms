import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/utils/cn'

interface TablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function TablePagination({ page, pageSize, total, onPageChange, className }: TablePaginationProps) {
  const { t } = useTranslation('common')
  const totalPages = Math.ceil(total / pageSize)
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t border-border text-sm', className)}>
      <span className="text-muted-foreground">
        {t('pagination.showing', { from, to, total })}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <span className="px-2 text-muted-foreground">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
