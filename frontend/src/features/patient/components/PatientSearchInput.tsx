import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X, User } from 'lucide-react'
import { useGetPatientsQuery, useGetPatientQuery, PatientDto } from '@/features/patient/api/patientApi'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { formatDate } from '@/shared/utils/formatDate'
import { cn } from '@/shared/utils/cn'

interface PatientSearchInputProps {
  value: string           // selected patientId
  onChange: (id: string) => void
  disabled?: boolean
  error?: string
}

function patientLabel(p: PatientDto): string {
  return `${p.lastName.toUpperCase()} ${p.firstName} — ${formatDate(p.birthDate)}`
}

export function PatientSearchInput({ value, onChange, disabled, error }: PatientSearchInputProps) {
  const { t } = useTranslation(['order', 'common'])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Load pre-selected patient (e.g. when arriving from PatientDetailPage)
  const { data: preloaded } = useGetPatientQuery(value, { skip: !value })

  // Search results
  const { data, isFetching } = useGetPatientsQuery(
    { query: debouncedQuery, pageSize: 8 },
    { skip: debouncedQuery.length < 2 },
  )

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (patient: PatientDto) => {
    onChange(patient.id)
    setQuery('')
    setOpen(false)
  }

  const handleClear = () => {
    onChange('')
    setQuery('')
  }

  // A patient is already selected
  if (value && preloaded) {
    return (
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {t('order:form.patient')}
        </label>
        <div className="flex items-center gap-2 px-3 py-2 border border-neutral-300 rounded-lg bg-primary-50">
          <User size={15} className="text-primary-600 shrink-0" />
          <span className="text-sm font-medium text-neutral-900 flex-1">
            {patientLabel(preloaded)}
          </span>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-neutral-400 hover:text-neutral-600"
              title={t('common:actions.cancel')}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    )
  }

  const results = data?.data ?? []
  const showDropdown = open && debouncedQuery.length >= 2

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {t('order:form.patient')}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search size={15} className="text-neutral-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={t('order:form.patientSearch')}
          disabled={disabled}
          className={cn(
            'w-full border rounded-lg ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
            error ? 'border-red-400 focus:ring-red-300' : 'border-neutral-300',
          )}
        />
        {showDropdown && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
            {isFetching ? (
              <div className="px-4 py-3 text-sm text-neutral-400">
                {t('common:states.loading')}
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-400">
                {t('order:form.patientNotFound')}
              </div>
            ) : (
              results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelect(p)}
                  className="w-full text-start px-4 py-2.5 text-sm hover:bg-primary-50 flex flex-col gap-0.5"
                >
                  <span className="font-medium text-neutral-900">
                    {p.lastName.toUpperCase()} {p.firstName}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {formatDate(p.birthDate)}
                    {p.phone ? ` · ${p.phone}` : ''}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
