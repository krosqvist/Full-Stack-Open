
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
      useNotificationStore
        .getState()
        .actions
        .setNotification(`You created a new anecdote "${content}"`)
    },

    remove: async (id) => {
      const anecdote = get().anecdotes.find(n => n.id === id)
      await anecdoteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter(n => n.id !== id) }))
      useNotificationStore
        .getState()
        .actions
        .setNotification(`You removed "${anecdote.content}"`)
    },

    vote: async (id) => {
      const anecdote = get().anecdotes.find(n => n.id === id)
      const updated = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({ anecdotes: state.anecdotes.map(n => n.id === id ? updated : n) }))
      useNotificationStore
        .getState()
        .actions
        .setNotification(`You voted "${anecdote.content}"`)
    },

    setFilter: value => set(() => ({ filter: value })),

    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
  }
}))

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: (value) => {set({ notification: value })
      setTimeout(() => {set({ notification: '' })}, 5000)
    },
  }
}))

export default useAnecdoteStore
export const useAnecdotes = () =>
  useAnecdoteStore(
    useShallow(state =>
      state.anecdotes
        .filter(anecdote =>
          anecdote.content
            .toLowerCase()
            .includes(state.filter.toLowerCase())
        )
        .toSorted((a, b) => b.votes - a.votes)
    )
  )
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useNotification = () => useNotificationStore((state) => state.notification)