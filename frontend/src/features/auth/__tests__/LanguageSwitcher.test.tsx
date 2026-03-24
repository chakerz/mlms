import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from '@/features/auth/components/LanguageSwitcher'

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/i18n/rtl', () => ({
  applyDirection: vi.fn(),
}))

const mockChangeLanguage = vi.fn().mockResolvedValue(undefined)
let currentLang = 'fr'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      get language() { return currentLang },
      changeLanguage: (lang: string) => {
        currentLang = lang
        return mockChangeLanguage(lang)
      },
    },
  }),
}))

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    currentLang = 'fr'
    mockChangeLanguage.mockClear()
  })

  it('renders FR button', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument()
  })

  it('renders AR button', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByRole('button', { name: 'ع' })).toBeInTheDocument()
  })

  it('switches to Arabic when AR button is clicked', () => {
    render(<LanguageSwitcher />)
    fireEvent.click(screen.getByRole('button', { name: 'ع' }))
    expect(currentLang).toBe('ar')
  })

  it('switches back to French when FR button is clicked', () => {
    currentLang = 'ar'
    render(<LanguageSwitcher />)
    fireEvent.click(screen.getByRole('button', { name: 'FR' }))
    expect(currentLang).toBe('fr')
  })
})
