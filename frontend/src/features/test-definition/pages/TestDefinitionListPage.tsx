import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EllipsisVertical, Plus, Search, Settings2, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from '@/shared/ui/shadcn/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import { Input } from '@/shared/ui/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table'
import { Pagination } from '@/shared/ui/Pagination/Pagination'
import { selectCurrentUser } from '@/features/auth/model/authSelectors'
import { UserRole } from '@/shared/types/app.types'
import { useGetTestDefinitionsQuery } from '../api/testDefinitionApi'

const CATEGORIES = [
  'BIOCHEMISTRY', 'HEMATOLOGY', 'HEMOSTASIS', 'SEROLOGY', 'IMMUNOLOGY',
  'MICROBIOLOGY', 'MOLECULAR_BIOLOGY', 'CYTOGENETICS', 'HORMONOLOGY',
  'ALLERGOLOGY', 'TUMOR_MARKERS',
] as const

const CATEGORY_BADGE_VARIANT: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  BIOCHEMISTRY: 'primary',
  HEMATOLOGY: 'destructive',
  HEMOSTASIS: 'warning',
  SEROLOGY: 'success',
  IMMUNOLOGY: 'info',
  MICROBIOLOGY: 'warning',
  MOLECULAR_BIOLOGY: 'primary',
  CYTOGENETICS: 'secondary',
  HORMONOLOGY: 'info',
  ALLERGOLOGY: 'destructive',
  TUMOR_MARKERS: 'secondary',
}

// Columns ordered logically; true = visible by default
const COLUMNS = [
  { key: 'name',               defaultVisible: true  },
  { key: 'code',               defaultVisible: false },
  { key: 'synonymes',          defaultVisible: false },
  { key: 'category',           defaultVisible: true  },
  { key: 'tube',               defaultVisible: true  },
  { key: 'sampleType',         defaultVisible: true  },
  { key: 'referenceRange',     defaultVisible: true  },
  { key: 'turnaroundTime',     defaultVisible: true  },
  { key: 'preAnalyticDelay',   defaultVisible: false },
  { key: 'method',             defaultVisible: false },
  { key: 'collectionCondition',defaultVisible: false },
  { key: 'fastingRequired',    defaultVisible: false },
  { key: 'minVolumeMl',        defaultVisible: false },
  { key: 'maxDelayMinutes',    defaultVisible: false },
  { key: 'storageTemp',        defaultVisible: false },
  { key: 'subcontracted',      defaultVisible: false },
  { key: 'isActive',           defaultVisible: true  },
] as const

type ColKey = (typeof COLUMNS)[number]['key']

const DEFAULT_VISIBILITY = Object.fromEntries(
  COLUMNS.map((c) => [c.key, c.defaultVisible])
) as Record<ColKey, boolean>

function ReferenceRangeCell({ low, high, unit }: { low: number | null; high: number | null; unit: string | null }) {
  if (low === null && high === null) return <span className="text-muted-foreground">—</span>
  const range =
    low !== null && high !== null
      ? `${low} – ${high}`
      : low !== null
        ? `≥ ${low}`
        : `≤ ${high}`
  return (
    <span className="text-xs text-foreground">
      {range}
      {unit && <span className="ms-1 text-muted-foreground">{unit}</span>}
    </span>
  )
}

export function TestDefinitionListPage() {
  const { t, i18n } = useTranslation('testDefinition')
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const isAdmin = user?.role === UserRole.ADMIN
  const isAr = i18n.language === 'ar'

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Record<ColKey, boolean>>(DEFAULT_VISIBILITY)

  const toggleColumn = (key: ColKey) =>
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))

  const { data, isLoading } = useGetTestDefinitionsQuery({
    page,
    pageSize,
    search: search || undefined,
    category: category || undefined,
  })

  const items = data?.data ?? []
  const total = data?.total ?? 0
  const visibleCount = Object.values(visibleColumns).filter(Boolean).length

  const col = (key: ColKey) => visibleColumns[key]

  // Column header label lookup
  const colLabel: Record<ColKey, string> = {
    code:                t('fields.code'),
    name:                t('fields.name'),
    synonymes:           t('fields.synonymes'),
    category:            t('fields.category'),
    tube:                t('fields.tube'),
    sampleType:          t('fields.sampleType'),
    referenceRange:      t('fields.referenceRange'),
    turnaroundTime:      t('fields.turnaroundTime'),
    preAnalyticDelay:    t('fields.preAnalyticDelay'),
    method:              t('fields.method'),
    collectionCondition: t('fields.collectionCondition'),
    fastingRequired:     t('fields.fastingRequired'),
    minVolumeMl:         t('fields.minVolumeMl'),
    maxDelayMinutes:     t('fields.maxDelayMinutes'),
    storageTemp:         t('fields.storageTemp'),
    subcontracted:       t('fields.subcontracted'),
    isActive:            t('fields.isActive'),
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('title')}</h1>
        {isAdmin && (
          <Button onClick={() => navigate('/test-definitions/new')}>
            <Plus className="size-4" />
            {t('actions.create')}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardToolbar>
            <Select
              value={category}
              onValueChange={(v) => { setCategory(v === '__all__' ? '' : v); setPage(1) }}
            >
              <SelectTrigger className="w-44" size="sm">
                <SelectValue placeholder={t('filters.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t('filters.allCategories')}</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{t(`categories.${c}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder={t('filters.search')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="ps-9 w-56"
                size="sm"
              />
              {search && (
                <Button
                  mode="icon"
                  variant="ghost"
                  className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => { setSearch(''); setPage(1) }}
                >
                  <X />
                </Button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="size-4" />
                  {t('common:table.columns')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px] max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="font-medium">{t('common:table.toggleColumns')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {COLUMNS.map(({ key }) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visibleColumns[key]}
                    onCheckedChange={() => toggleColumn(key)}
                  >
                    {colLabel[key]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardToolbar>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/60">
                  {col('name') && (
                    <TableHead className="text-start min-w-[180px] text-secondary-foreground h-10">
                      {colLabel.name}
                    </TableHead>
                  )}
                  {col('code') && (
                    <TableHead className="text-start min-w-[80px] text-secondary-foreground h-10">
                      {colLabel.code}
                    </TableHead>
                  )}
                  {col('synonymes') && (
                    <TableHead className="text-start min-w-[140px] text-secondary-foreground h-10">
                      {colLabel.synonymes}
                    </TableHead>
                  )}
                  {col('category') && (
                    <TableHead className="min-w-[130px] text-secondary-foreground h-10">
                      {colLabel.category}
                    </TableHead>
                  )}
                  {col('tube') && (
                    <TableHead className="min-w-[110px] text-secondary-foreground h-10">
                      {colLabel.tube}
                    </TableHead>
                  )}
                  {col('sampleType') && (
                    <TableHead className="min-w-[110px] text-secondary-foreground h-10">
                      {colLabel.sampleType}
                    </TableHead>
                  )}
                  {col('referenceRange') && (
                    <TableHead className="min-w-[130px] text-secondary-foreground h-10">
                      {colLabel.referenceRange}
                    </TableHead>
                  )}
                  {col('turnaroundTime') && (
                    <TableHead className="min-w-[110px] text-secondary-foreground h-10">
                      {colLabel.turnaroundTime}
                    </TableHead>
                  )}
                  {col('preAnalyticDelay') && (
                    <TableHead className="min-w-[140px] text-secondary-foreground h-10">
                      {colLabel.preAnalyticDelay}
                    </TableHead>
                  )}
                  {col('method') && (
                    <TableHead className="min-w-[110px] text-secondary-foreground h-10">
                      {colLabel.method}
                    </TableHead>
                  )}
                  {col('collectionCondition') && (
                    <TableHead className="min-w-[160px] text-secondary-foreground h-10">
                      {colLabel.collectionCondition}
                    </TableHead>
                  )}
                  {col('fastingRequired') && (
                    <TableHead className="min-w-[90px] text-secondary-foreground h-10">
                      {colLabel.fastingRequired}
                    </TableHead>
                  )}
                  {col('minVolumeMl') && (
                    <TableHead className="min-w-[100px] text-secondary-foreground h-10">
                      {colLabel.minVolumeMl}
                    </TableHead>
                  )}
                  {col('maxDelayMinutes') && (
                    <TableHead className="min-w-[110px] text-secondary-foreground h-10">
                      {colLabel.maxDelayMinutes}
                    </TableHead>
                  )}
                  {col('storageTemp') && (
                    <TableHead className="min-w-[130px] text-secondary-foreground h-10">
                      {colLabel.storageTemp}
                    </TableHead>
                  )}
                  {col('subcontracted') && (
                    <TableHead className="min-w-[100px] text-secondary-foreground h-10">
                      {colLabel.subcontracted}
                    </TableHead>
                  )}
                  {col('isActive') && (
                    <TableHead className="min-w-[80px] text-secondary-foreground h-10">
                      {colLabel.isActive}
                    </TableHead>
                  )}
                  <TableHead className="w-[50px] h-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={visibleCount + 1} className="text-center py-8 text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('common:states.loading')}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleCount + 1} className="text-center py-8 text-muted-foreground">
                      {t('common:states.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((def) => (
                    <TableRow
                      key={def.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/test-definitions/${def.id}`)}
                    >
                      {col('name') && (
                        <TableCell className="text-start py-3">
                          <div
                            className="text-sm font-medium text-foreground hover:text-primary"
                            onClick={(e) => { e.stopPropagation(); navigate(`/test-definitions/${def.id}`) }}
                          >
                            {isAr ? def.nameAr : def.nameFr}
                          </div>
                        </TableCell>
                      )}
                      {col('code') && (
                        <TableCell className="text-start py-3">
                          <span className="font-mono text-xs text-muted-foreground">{def.code}</span>
                        </TableCell>
                      )}
                      {col('synonymes') && (
                        <TableCell className="text-start py-3">
                          {def.synonymes
                            ? <span className="text-xs text-muted-foreground">{def.synonymes}</span>
                            : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                      )}
                      {col('category') && (
                        <TableCell className="py-3">
                          <Badge
                            variant={CATEGORY_BADGE_VARIANT[def.category] ?? 'secondary'}
                            appearance="light"
                          >
                            {t(`categories.${def.category}`, def.category)}
                          </Badge>
                        </TableCell>
                      )}
                      {col('tube') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {isAr ? (def.tubeAr ?? def.tubeFr ?? '—') : (def.tubeFr ?? '—')}
                        </TableCell>
                      )}
                      {col('sampleType') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {isAr ? (def.sampleTypeAr ?? def.sampleTypeFr ?? '—') : (def.sampleTypeFr ?? '—')}
                        </TableCell>
                      )}
                      {col('referenceRange') && (
                        <TableCell className="py-3">
                          <ReferenceRangeCell
                            low={def.referenceLow}
                            high={def.referenceHigh}
                            unit={def.unit}
                          />
                        </TableCell>
                      )}
                      {col('turnaroundTime') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {isAr ? (def.turnaroundTimeAr ?? def.turnaroundTime ?? '—') : (def.turnaroundTime ?? '—')}
                        </TableCell>
                      )}
                      {col('preAnalyticDelay') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {isAr ? (def.preAnalyticDelayAr ?? def.preAnalyticDelay ?? '—') : (def.preAnalyticDelay ?? '—')}
                        </TableCell>
                      )}
                      {col('method') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {def.method ?? '—'}
                        </TableCell>
                      )}
                      {col('collectionCondition') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {isAr ? (def.collectionConditionAr ?? def.collectionConditionFr ?? '—') : (def.collectionConditionFr ?? '—')}
                        </TableCell>
                      )}
                      {col('fastingRequired') && (
                        <TableCell className="py-3">
                          <Badge
                            variant={def.fastingRequired ? 'warning' : 'secondary'}
                            appearance="light"
                          >
                            {t(`bool.${def.fastingRequired ? 'yes' : 'no'}`)}
                          </Badge>
                        </TableCell>
                      )}
                      {col('minVolumeMl') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {def.minVolumeMl != null ? `${def.minVolumeMl} mL` : '—'}
                        </TableCell>
                      )}
                      {col('maxDelayMinutes') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {def.maxDelayMinutes != null ? `${def.maxDelayMinutes} min` : '—'}
                        </TableCell>
                      )}
                      {col('storageTemp') && (
                        <TableCell className="text-sm text-secondary-foreground py-3">
                          {def.storageTemp ?? '—'}
                        </TableCell>
                      )}
                      {col('subcontracted') && (
                        <TableCell className="py-3">
                          <Badge
                            variant={def.subcontracted ? 'info' : 'secondary'}
                            appearance="light"
                          >
                            {t(`bool.${def.subcontracted ? 'yes' : 'no'}`)}
                          </Badge>
                        </TableCell>
                      )}
                      {col('isActive') && (
                        <TableCell className="py-3">
                          <Badge variant={def.isActive ? 'success' : 'secondary'} appearance="light">
                            {t(`status.${def.isActive ? 'active' : 'inactive'}`)}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell className="py-3 text-end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" mode="icon" className="size-7">
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuItem onClick={() => navigate(`/test-definitions/${def.id}`)}>
                              {t('common:actions.seeAll')}
                            </DropdownMenuItem>
                            {isAdmin && (
                              <DropdownMenuItem onClick={() => navigate(`/test-definitions/${def.id}/edit`)}>
                                {t('common:actions.edit')}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        />
      </Card>
    </div>
  )
}
