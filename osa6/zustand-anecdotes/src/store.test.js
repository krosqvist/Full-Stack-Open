import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [
        { id: 1, content: 'Test', votes: 1 },
        { id: 2, content: 'Second test', votes: 0 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('voting adds a vote to the anecdote', async () => {
    const mockAnecdote = { id: 1, content: 'Test', votes: 1 }
    useAnecdoteStore.setState({ anecdotes: [mockAnecdote] })
    anecdoteService.update.mockResolvedValue({ ...mockAnecdote, votes: 2 })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual([{ id: 1, content: 'Test', votes: 2 }])
  })
})

describe('useAnecdotes', () => {
  const anecdotes = [
    { id: 1, content: 'A', votes: 2 },
    { id: 2, content: 'B', votes: 5 },
    { id: 3, content: 'C', votes: 1 }
  ]

  it('anecdotes are sorted by votes in descending order', () => {
    useAnecdoteStore.setState({ anecdotes })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current.map(a => a.id)).toEqual([2, 1, 3])
  })

  it('the anecdotes are filtered correctly', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'b' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([{ id: 2, content: 'B', votes: 5 }])
  })
})