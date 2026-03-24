import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { LoginForm } from '@/features/auth/components/LoginForm'

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'fr', changeLanguage: vi.fn() },
  }),
}))

const mockLogin = vi.fn()
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin, isLoading: false, error: undefined }),
}))

const testStore = configureStore({
  reducer: {
    auth: (state = { token: null, user: null, isAuthenticated: false }) => state,
  },
})

function renderForm() {
  return render(
    <Provider store={testStore}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </Provider>,
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('LoginForm', () => {
  beforeEach(() => mockLogin.mockClear())

  it('renders email input', () => {
    renderForm()
    expect(screen.getByRole('textbox', { name: /fields\.email/i })).toBeInTheDocument()
  })

  it('renders password input', () => {
    renderForm()
    expect(screen.getByLabelText(/fields\.password/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /actions\.login/i })).toBeInTheDocument()
  })

  it('calls login with valid credentials on submit', async () => {
    renderForm()

    fireEvent.change(screen.getByRole('textbox', { name: /fields\.email/i }), {
      target: { value: 'admin@lab.com' },
    })
    fireEvent.change(screen.getByLabelText(/fields\.password/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /actions\.login/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@lab.com',
        password: 'Test1234!',
      })
    })
  })

  it('does not call login when email is missing', async () => {
    renderForm()

    fireEvent.change(screen.getByLabelText(/fields\.password/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /actions\.login/i }))

    // Allow micro-task queue to flush before asserting
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })
})
