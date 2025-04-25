// src/__tests__/Navbar.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  afterEach(() => localStorage.clear())

  it('shows Register on the /login page when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Navbar />
      </MemoryRouter>
    )
    // At /login, we should see a Register button
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Log in/i })).toBeNull()
  })

  it('shows Log in on the /register page when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Register/i })).toBeNull()
  })

  it('shows Log out whenever a token is present', () => {
    localStorage.setItem('token', JSON.stringify('fake'))
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /Log out/i })).toBeInTheDocument()
  })
})
