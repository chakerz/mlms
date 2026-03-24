import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PatientForm } from '@/features/patient/components/PatientForm'

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'fr' },
  }),
}))

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PatientForm render', () => {
  it('renders firstName and lastName inputs', () => {
    render(<PatientForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: /form\.firstName/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /form\.lastName/i })).toBeInTheDocument()
  })

  it('renders birthDate input', () => {
    render(<PatientForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText(/form\.birthDate/i)).toBeInTheDocument()
  })

  it('renders gender select', () => {
    render(<PatientForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders phone and email inputs', () => {
    render(<PatientForm onSubmit={vi.fn()} />)
    expect(screen.getByLabelText(/form\.phone/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /form\.email/i })).toBeInTheDocument()
  })

  it('renders save button', () => {
    render(<PatientForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: /actions\.save/i })).toBeInTheDocument()
  })

  it('calls onSubmit with filled data', async () => {
    const onSubmit = vi.fn()
    render(<PatientForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByRole('textbox', { name: /form\.firstName/i }), {
      target: { value: 'Amina' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /form\.lastName/i }), {
      target: { value: 'El Idrissi' },
    })
    fireEvent.change(screen.getByLabelText(/form\.birthDate/i), {
      target: { value: '1992-05-12' },
    })
    fireEvent.click(screen.getByRole('button', { name: /actions\.save/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Amina', lastName: 'El Idrissi' }),
      )
    })
  })

  it('does not call onSubmit when required fields are empty', async () => {
    const onSubmit = vi.fn()
    render(<PatientForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: /actions\.save/i }))

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
