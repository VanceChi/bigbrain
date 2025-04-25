import React from 'react'
import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Dashboard from '../pages/Dashboard'
// Stub out GameCard so it doesn’t try to read SessionContext
vi.mock('../components/GameCard', () => ({
  default: (props) => <div data-testid="gamecard">{props.title || 'GameCard'}</div>
}))

import * as queryModule from '../utils/query'
import * as apiModule from '../utils/api'
import { MemoryRouter } from 'react-router-dom'

describe('Dashboard integration', () => {
  beforeEach(() => {
    vi.spyOn(queryModule, 'queryGames').mockResolvedValue([])
    vi.spyOn(apiModule, 'apiCall').mockImplementation((path, method, data) => {
      if (method === 'PUT' && path === '/admin/games') {
        return Promise.resolve({ games: data.games })
      }
      return Promise.resolve({ games: [] })
    })
  })

  it('allows creating a new game and shows it in the list', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Dashboard />
      </MemoryRouter>
    )

    // 1) open the create-game form
    fireEvent.click(screen.getByRole('button', { name: /\+ Game/i }))

    // 2) enter a name via placeholder
    fireEvent.change(
      screen.getByPlaceholderText(/Set Name/i),
      { target: { value: 'Vitest Game' } }
    )

    // 3) submit
    fireEvent.click(screen.getByRole('button', { name: /Sumbit/i }))

    // 4) wait for the stubbed GameCard to show the new title
    await waitFor(() => {
      expect(screen.getByTestId('gamecard')).toHaveTextContent('Vitest Game')
    })
  })
})
