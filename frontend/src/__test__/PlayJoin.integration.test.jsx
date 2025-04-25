// src/__tests__/PlayJoin.integration.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as apiModule from '../utils/api'

// 1) Mock react-router-dom as a module before importing PlayJoin:
const navigateMock = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ sessionId: undefined }),  // default
  }
})

// 2) Now import after the mock
import PlayJoin from '../pages/PlayJoin'

describe('PlayJoin integration', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    vi.restoreAllMocks()
  })

  it('prompts for session ID then navigates to join URL', () => {
    // override useParams to no sessionId
    vi.mocked(require('react-router-dom').useParams).mockReturnValue({ sessionId: undefined })

    render(<PlayJoin />)

    // Should show session ID prompt
    expect(screen.getByText(/Give Session Id here/i)).toBeInTheDocument()

    // Enter a session ID and click Submit
    fireEvent.change(screen.getByPlaceholderText(/Enter Session id/i), { target: { value: 'ABC123' } })
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    // Should have navigated
    expect(navigateMock).toHaveBeenCalledWith('/play/join/ABC123')
  })

  it('prompts for name when sessionId param present and navigates on successful join', async () => {
    // override useParams to have a sessionId
    vi.mocked(require('react-router-dom').useParams).mockReturnValue({ sessionId: 'XYZ789' })
    // Stub apiCall
    vi.spyOn(apiModule, 'apiCall').mockResolvedValue({ playerId: 'PLAYER1' })

    render(<PlayJoin />)

    // Should show name prompt
    expect(screen.getByText(/Give your name here/i)).toBeInTheDocument()

    // Enter name and click Submit
    fireEvent.change(screen.getByPlaceholderText(/Enter Name/i), { target: { value: 'Alice' } })
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    await waitFor(() => {
      // API called correctly
      expect(apiModule.apiCall).toHaveBeenCalledWith('/play/join/XYZ789', 'POST', { name: 'Alice' })
      // Navigation to player route
      expect(navigateMock).toHaveBeenCalledWith('/play/PLAYER1', { state: { sessionId: 'XYZ789' } })
    })
  })
})
