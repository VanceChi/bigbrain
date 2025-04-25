import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LobbyRoom from '../components/LobbyRoom'

describe('LobbyRoom component', () => {
  it('renders a spinner', () => {
    +   render(<LobbyRoom />)
    +   // Spinner is the element with the 'animate-spin' class:
    +   expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders the waiting message', () => {
    render(<LobbyRoom />)
    expect(screen.getByText(/Waiting for the game to begin/i)).toBeInTheDocument()
  })

  it('renders three bouncing dots', () => {
    render(<LobbyRoom />)
    const dots = document.querySelectorAll('.animate-bounce')
    expect(dots).toHaveLength(3)
  })
})
