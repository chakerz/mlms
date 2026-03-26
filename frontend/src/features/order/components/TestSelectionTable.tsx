import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/shared/ui/Input'
import { CreateTestOrderItem } from '@/features/order/api/orderApi'
import { useGetTestDefinitionsQuery } from '@/features/test-definition/api/testDefinitionApi'

// Codes affichés en "Utilisées fréquemment" – ordre par fréquence clinique
const FREQUENT_CODES = [
  'NFS', 'HGB', 'WBC', 'PLT',
  'GLU', 'HBA1C', 'CRE', 'UREA',
  'CHOL', 'TG', 'HDL', 'LDL',
  'AST', 'ALT', 'GGT', 'ALP',
  'CRP', 'TSH', 'FT4', 'FT3',
  'PT', 'INR',
]

const CATEGORY_ORDER = [
  'BIOCHEMISTRY', 'HEMATOLOGY', 'HEMOSTASIS', 'HORMONOLOGY',
  'SEROLOGY', 'IMMUNOLOGY', 'MICROBIOLOGY', 'MOLECULAR_BIOLOGY',
  'TUMOR_MARKERS', 'CYTOGENETICS', 'ALLERGOLOGY',
]

interface TestSelectionTableProps {
  selected: CreateTestOrderItem[]
  onChange: (tests: CreateTestOrderItem[]) => void
}

export function TestSelectionTable({ selected, onChange }: TestSelectionTableProps) {
  const { t, i18n } = useTranslation('order')
  const { t: tTd } = useTranslation('testDefinition')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300)
  }

  const { data, isLoading } = useGetTestDefinitionsQuery({
    pageSize: 2000,
    activeOnly: true,
    search: debouncedSearch || undefined,
    category: activeCategory || undefined,
  })

  // Separate unfiltered query to always know which categories exist
  const { data: allData } = useGetTestDefinitionsQuery({ pageSize: 2000, activeOnly: true })

  const allTests = data?.data ?? []
  const isAr = i18n.language === 'ar'

  const getName = (test: { nameFr: string; nameAr: string }) =>
    isAr ? test.nameAr : test.nameFr

  const selectedCodes = new Set(selected.map((s) => s.testCode))

  const frequentTests = FREQUENT_CODES
    .map((code) => (allData?.data ?? allTests).find((td) => td.code === code))
    .filter((td): td is NonNullable<typeof td> => !!td && !selectedCodes.has(td.code))

  const presentCategories = CATEGORY_ORDER.filter((c) =>
    (allData?.data ?? allTests).some((td) => td.category === c),
  )

  const filtered = allTests.filter((test) => {
    if (selectedCodes.has(test.code)) return false
    return true
  })

  const add = (test: { code: string; nameFr: string; nameAr: string }) => {
    onChange([
      ...selected,
      { testCode: test.code, testNameFr: test.nameFr, testNameAr: test.nameAr, priority: 'ROUTINE' },
    ])
  }

  const remove = (code: string) => {
    onChange(selected.filter((s) => s.testCode !== code))
  }

  return (
    <div className="space-y-3">
      {/* ── Selected tests ── */}
      {selected.length > 0 && (
        <div className="border border-blue-200 bg-blue-50 rounded-lg divide-y divide-blue-100">
          {selected.map((s) => (
            <div key={s.testCode} className="flex items-center justify-between px-4 py-2">
              <div>
                <span className="text-sm font-semibold text-blue-900">{s.testCode}</span>
                <span className="text-sm text-blue-700 ms-2">
                  {isAr ? s.testNameAr : s.testNameFr}
                </span>
              </div>
              <button
                type="button"
                onClick={() => remove(s.testCode)}
                className="text-blue-300 hover:text-danger-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Frequently used ── */}
      {!isLoading && frequentTests.length > 0 && (
        <div>
          <p className="text-xs text-neutral-500 mb-2">{t('form.frequentlyUsed')}</p>
          <div className="flex flex-wrap gap-2">
            {frequentTests.map((test) => (
              <button
                key={test.code}
                type="button"
                onClick={() => add(test)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <Plus size={11} />
                <span>{test.code}</span>
                <span className="text-amber-600 hidden sm:inline">— {getName(test)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Category tabs ── */}
      {!isLoading && presentCategories.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              activeCategory === null
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {t('form.allCategories')}
          </button>
          {presentCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tTd(`categories.${cat}`)}
            </button>
          ))}
        </div>
      )}

      {/* ── Search ── */}
      <div className="pt-2">
      <Input
        placeholder={t('form.searchTest')}
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      </div>

      {/* ── Catalog list ── */}
      <div className="max-h-[30rem] overflow-y-auto border border-neutral-200 rounded-lg divide-y divide-neutral-100">
        {isLoading ? (
          <p className="px-4 py-3 text-sm text-neutral-400">{t('form.loading')}</p>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-3 text-sm text-neutral-400">{t('form.noTests')}</p>
        ) : (
          filtered.map((test) => (
            <div
              key={test.code}
              className="flex items-center justify-between px-4 py-2 hover:bg-neutral-50"
            >
              <div className="min-w-0">
                <span className="text-sm font-medium text-neutral-700">{test.code}</span>
                <span className="text-sm text-neutral-600 ms-2">{getName(test)}</span>
                <span className="text-xs text-neutral-400 ms-2 hidden sm:inline">
                  · {tTd(`categories.${test.category}`)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => add(test)}
                className="ms-2 shrink-0 text-primary hover:text-primary-dark transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
