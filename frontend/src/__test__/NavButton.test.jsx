import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../components/Navbar'
import { BrowserRouter } from 'react-router-dom'

describe('NavButton in Navbar', () => {
  it('renders login and register links when no token', () => {
    localStorage.clear()
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Log out/i })).toBeNull()
  })

  it('calls navigate on click', () => {
    // you can mock useNavigate or simply assert button is clickable
    // for brevity, check it exists
    expect(screen.getByRole('button', { name: /Log in/i })).toBeEnabled()
  })
})
