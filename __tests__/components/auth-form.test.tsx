import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthProvider } from '@/components/providers/auth-provider'

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  }),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sign in form by default', () => {
    render(
      <MockAuthProvider>
        <AuthForm />
      </MockAuthProvider>
    )

    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('switches between sign in and sign up tabs', () => {
    render(
      <MockAuthProvider>
        <AuthForm />
      </MockAuthProvider>
    )

    const signUpTab = screen.getByRole('tab', { name: /sign up/i })
    fireEvent.click(signUpTab)

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <MockAuthProvider>
        <AuthForm />
      </MockAuthProvider>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInvalid()
    })
  })

  it('shows loading state during submission', async () => {
    render(
      <MockAuthProvider>
        <AuthForm />
      </MockAuthProvider>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <MockAuthProvider>
        <AuthForm />
      </MockAuthProvider>
    )

    // Check for proper labels
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

    // Check for proper form structure
    expect(screen.getByRole('form')).toBeInTheDocument()

    // Check for proper button roles
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    render(
      <MockAuthProvider>
        <AuthForm />
      </MockAuthProvider>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    // Tab navigation should work
    emailInput.focus()
    expect(document.activeElement).toBe(emailInput)

    fireEvent.keyDown(emailInput, { key: 'Tab' })
    expect(document.activeElement).toBe(passwordInput)
  })
})
