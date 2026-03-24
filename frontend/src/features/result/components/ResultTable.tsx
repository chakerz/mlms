import { useTranslation } from 'react-i18next'
import { EllipsisVertical } from 'lucide-react'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table'
import { ResultFlagBadge } from './ResultFlagBadge'
import { ReferenceRange } from './ReferenceRange'
import { ResultDto } from '@/features/result/api/resultApi'
import { formatDateTime } from '@/shared/utils/formatDate'
import { cn } from '@/shared/utils/cn'

interface ResultTableProps {
  results: ResultDto[]
  onEdit?: (result: ResultDto) => void
  isLoading?: boolean
}

export function ResultTable({ results, onEdit, isLoading }: ResultTableProps) {
  const { t, i18n } = useTranslation(['result', 'common'])

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent/60">
            <TableHead className="text-start min-w-[180px] text-secondary-foreground h-10">
              {t('result:fields.analysis')}
            </TableHead>
            <TableHead className="text-start min-w-[110px] text-secondary-foreground h-10">
              {t('result:fields.value')}
            </TableHead>
            <TableHead className="min-w-[100px] text-secondary-foreground h-10">
              {t('result:fields.flag')}
            </TableHead>
            <TableHead className="min-w-[130px] text-secondary-foreground h-10">
              {t('result:fields.reference')}
            </TableHead>
            <TableHead className="min-w-[140px] text-secondary-foreground h-10">
              {t('result:fields.measuredAt')}
            </TableHead>
            {onEdit && <TableHead className="w-[50px] h-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={onEdit ? 6 : 5} className="text-center py-8 text-muted-foreground">
                <div className="flex justify-center items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('common:states.loading')}
                </div>
              </TableCell>
            </TableRow>
          ) : results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={onEdit ? 6 : 5} className="text-center py-8 text-muted-foreground">
                {t('result:messages.empty')}
              </TableCell>
            </TableRow>
          ) : (
            results.map((r) => (
              <TableRow
                key={r.id}
                className={cn(r.flag === 'CRITICAL' && 'bg-destructive/5')}
              >
                <TableCell className="text-start py-3">
                  <span className="font-mono text-xs text-muted-foreground me-2">{r.testCode}</span>
                  <span className="text-sm font-medium text-foreground">
                    {i18n.language === 'ar' ? r.testNameAr : r.testNameFr}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-semibold text-foreground">{r.value}</span>
                  {r.unit && <span className="ms-1 text-xs text-muted-foreground">{r.unit}</span>}
                </TableCell>
                <TableCell className="py-3">
                  <ResultFlagBadge flag={r.flag} />
                </TableCell>
                <TableCell className="py-3">
                  <ReferenceRange low={r.referenceLow} high={r.referenceHigh} unit={r.unit} />
                </TableCell>
                <TableCell className="py-3 text-xs text-muted-foreground">
                  {formatDateTime(r.measuredAt)}
                </TableCell>
                {onEdit && (
                  <TableCell className="py-3 text-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" mode="icon" className="size-7">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem onClick={() => onEdit(r)}>
                          {t('common:actions.edit')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
