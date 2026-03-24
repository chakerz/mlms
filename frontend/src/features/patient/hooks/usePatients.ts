import { useState } from 'react'
import { useGetPatientsQuery } from '@/features/patient/api/patientApi'
import { useDebounce } from '@/shared/hooks/useDebounce'

export function usePatients(initialPageSize = 20) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isFetching } = useGetPatientsQuery({
    page,
    pageSize,
    query: debouncedSearch || undefined,
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return {
    patients: data?.data ?? [],
    total: data?.meta.total ?? 0,
    page,
    pageSize,
    search,
    isLoading,
    isFetching,
    setPage,
    setPageSize: handlePageSize,
    handleSearch,
  }
}
