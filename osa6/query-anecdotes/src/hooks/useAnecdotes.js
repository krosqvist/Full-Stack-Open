import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, createNew, update } from '../requests'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false
  })

  console.log(result)

  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], anecdotes => anecdotes.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote))
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    onCreate: (content) => newAnecdoteMutation.mutateAsync({ content, votes: 0 }),
    handleVote: (anecdote) => updateAnecdoteMutation.mutateAsync({ ...anecdote, votes: anecdote.votes + 1 }),
  }
}