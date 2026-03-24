import { cn } from '@/shared/utils/cn'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/shared/ui/shadcn/table'

export interface Column<T> {
  key: string
  header: string
  render?: (value: unknown, row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  rowKey?: (row: T) => string | number
  /** Alias for rowKey */
  keyExtractor?: (row: T) => string | number
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data',
  className,
  rowKey,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  const getKey = rowKey ?? keyExtractor
  return (
    <div className={cn('w-full', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={cn('whitespace-nowrap font-medium', col.className)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent" />
                  <span>Loading…</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={getKey ? getKey(row) : i}
                className={cn(onRowClick && 'cursor-pointer')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => {
                  const value = (row as Record<string, unknown>)[col.key]
                  return (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(value, row) : (value as React.ReactNode)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
