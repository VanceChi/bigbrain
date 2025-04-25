import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Form from '../components/Form'

describe('Form component', () => {
  const mockSubmit = vi.fn(e => e.preventDefault())

  const defaultProps = {
    onSubmit: mockSubmit,
    name: '',
    setName: () => {},
    email: '',
    setEmail: () => {},
    password: '',
    setPassword: () => {},
    confirmPassword: '',
    setConfirmPassword: () => {},
    error: '',
    validationError: '',
    buttonText: 'Submit',
  }

  it('renders all fields when props provided', () => {
    render(<Form {...defaultProps} />)
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    const btn = screen.getByRole('button', { name: /Submit/i })
    expect(btn).toBeEnabled()
  })

  it('calls onSubmit when form is submitted', () => {
    render(<Form {...defaultProps} />)
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }))
    expect(mockSubmit).toHaveBeenCalled()
  })

  it('displays validationError and error messages', () => {
    render(<Form {...defaultProps} validationError="Invalid!" error="Oops!" />)
    expect(screen.getByText(/Invalid!/i)).toBeInTheDocument()
    expect(screen.getByText(/Oops!/i)).toBeInTheDocument()
  })
})

