import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { EllipsisVertical, Filter, Plus, Search, Settings2, X } from 'lucide-react'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/shared/ui/shadcn/card'
import { Checkbox } from '@/shared/ui/shadcn/checkbox'
import { DataGrid, useDataGrid } from '@/shared/ui/shadcn/data-grid'
import { DataGridColumnHeader } from '@/shared/ui/shadcn/data-grid-column-header'
import { DataGridColumnVisibility } from '@/shared/ui/shadcn/data-grid-column-visibility'
import { DataGridPagination } from '@/shared/ui/shadcn/data-grid-pagination'
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/shared/ui/shadcn/data-grid-table'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/shadcn/popover'
import { ScrollArea, ScrollBar } from '@/shared/ui/shadcn/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import { usePatients } from '@/features/patient/hooks/usePatients'
import { PatientDto, useDeletePatientMutation } from '@/features/patient/api/patientApi'
import { formatDate, formatDateTime } from '@/shared/utils/formatDate'

const GENDERS = ['M', 'F', 'O'] as const

export function PatientListPage() {
  const { t, i18n } = useTranslation(['patient', 'common'])
  const navigate = useNavigate()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  const [deletePatient] = useDeletePatientMutation()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = useState<string[]>([])

  const { patients, total, page, pageSize, isLoading, setPage, setPageSize, handleSearch } = usePatients()

  const filteredData = useMemo(() => {
    if (!selectedGenders.length) return patients
    return patients.filter((p) => selectedGenders.includes(p.gender))
  }, [patients, selectedGenders])

  const genderCounts = useMemo(() => {
    return GENDERS.reduce(
      (acc, g) => {
        acc[g] = patients.filter((p) => p.gender === g).length
        return acc
      },
      {} as Record<string, number>,
    )
  }, [patients])

  const handleGenderChange = (checked: boolean, value: string) => {
    setSelectedGenders((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    )
  }

  const pagination: PaginationState = { pageIndex: page - 1, pageSize }

  const columns = useMemo<ColumnDef<PatientDto>[]>(
    () => [
      {
        id: 'select',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 51,
      },
      {
        id: 'name',
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        header: ({ column }) => (
          <DataGridColumnHeader title={t('form.lastName')} column={column} visibility />
        ),
        cell: ({ row }) => (
          <div>
            <span className="font-semibold text-secondary-foreground">
              {row.original.lastName.toUpperCase()}
            </span>{' '}
            <span className="text-secondary-foreground">{row.original.firstName}</span>
          </div>
        ),
        enableSorting: true,
        size: 220,
        meta: { headerTitle: t('form.lastName') },
      },
      {
        id: 'birthDate',
        accessorFn: (row) => row.birthDate,
        header: ({ column }) => (
          <DataGridColumnHeader title={t('form.birthDate')} column={column} visibility />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground font-normal">
            {formatDate(row.original.birthDate)}
          </span>
        ),
        enableSorting: true,
        size: 140,
        meta: { headerTitle: t('form.birthDate') },
      },
      {
        id: 'gender',
        accessorFn: (row) => row.gender,
        header: ({ column }) => (
          <DataGridColumnHeader title={t('form.gender')} column={column} visibility />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.gender === 'M'
                ? 'primary'
                : row.original.gender === 'F'
                  ? 'destructive'
                  : 'secondary'
            }
            appearance="light"
          >
            {t(`gender.${row.original.gender}`)}
          </Badge>
        ),
        enableSorting: true,
        size: 100,
        meta: { headerTitle: t('form.gender') },
      },
      {
        id: 'phone',
        accessorFn: (row) => row.phone ?? '',
        header: ({ column }) => (
          <DataGridColumnHeader title={t('form.phone')} column={column} visibility />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground font-normal">{row.original.phone ?? '–'}</span>
        ),
        enableSorting: false,
        size: 140,
        meta: { headerTitle: t('form.phone') },
      },
      {
        id: 'address',
        accessorFn: (row) => row.address ?? '',
        header: ({ column }) => (
          <DataGridColumnHeader title={t('form.address')} column={column} visibility />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground font-normal">{row.original.address ?? '–'}</span>
        ),
        enableSorting: false,
        size: 200,
        meta: { headerTitle: t('form.address') },
      },
      {
        id: 'createdAt',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => (
          <DataGridColumnHeader title={t('form.createdAt')} column={column} visibility />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
        enableSorting: true,
        size: 170,
        meta: { headerTitle: t('form.createdAt') },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-7" mode="icon" variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => navigate(`/patients/${row.original.id}`)}>
                {t('actions.view')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/patients/${row.original.id}/edit`)}>
                {t('common:actions.edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deletePatient(row.original.id)}
              >
                {t('common:actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 60,
      },
    ],
    [t, navigate, deletePatient],
  )

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil(total / pageSize),
    getRowId: (row: PatientDto) => row.id,
    state: {
      pagination,
      sorting,
      rowSelection,
      columnVisibility,
      columnOrder,
    },
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const next = updater(pagination)
        if (next.pageSize !== pageSize) {
          setPageSize(next.pageSize)
        } else {
          setPage(next.pageIndex + 1)
        }
      }
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  })

  const Toolbar = () => {
    const { table } = useDataGrid()
    return (
      <CardToolbar>
        <DataGridColumnVisibility
          table={table}
          label={t('common:table.toggleColumns')}
          trigger={
            <Button variant="outline">
              <Settings2 />
              {t('common:table.columns')}
            </Button>
          }
        />
      </CardToolbar>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{t('title.list')}</h1>
        <Button onClick={() => navigate('/patients/new')}>
          <Plus className="size-4" />
          {t('actions.create')}
        </Button>
      </div>

      <DataGrid
        table={table}
        recordCount={total}
        isLoading={isLoading}
        tableLayout={{
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
          cellBorder: true,
        }}
      >
        <Card>
          <CardHeader>
            <CardHeading>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      handleSearch(e.target.value)
                    }}
                    className="ps-9 w-44"
                  />
                  {searchQuery.length > 0 && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => {
                        setSearchQuery('')
                        handleSearch('')
                      }}
                    >
                      <X />
                    </Button>
                  )}
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Filter />
                      {t('form.gender')}
                      {selectedGenders.length > 0 && (
                        <Badge variant="outline">{selectedGenders.length}</Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-3" align="start">
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-muted-foreground">Filters</div>
                      <div className="space-y-3">
                        {GENDERS.map((gender) => (
                          <div key={gender} className="flex items-center gap-2.5">
                            <Checkbox
                              id={`gender-${gender}`}
                              checked={selectedGenders.includes(gender)}
                              onCheckedChange={(checked) =>
                                handleGenderChange(checked === true, gender)
                              }
                            />
                            <Label
                              htmlFor={`gender-${gender}`}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              {t(`gender.${gender}`)}
                              <span className="text-muted-foreground">{genderCounts[gender]}</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeading>
            <Toolbar />
          </CardHeader>

          <CardTable>
            <ScrollArea dir={dir}>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>

          <CardFooter>
            <DataGridPagination
              sizesLabel={t('common:table.rowsPerPage')}
              info={t('common:table.pagination')}
            />
          </CardFooter>
        </Card>
      </DataGrid>
    </div>
  )
}
