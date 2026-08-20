import { useAnecdotes } from '../hooks/useAnecdotes'
import useNotify from '../hooks/useNotify'

const Anecdotes = () => {
  const { anecdotes, handleVote } = useAnecdotes()
  const { showNotification } = useNotify()

  const vote = async (anecdote) => {
    try {
      await handleVote(anecdote)
      showNotification(`you voted for ${anecdote.content}`)
    } catch {
      showNotification('voting failed')
    }
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Anecdotes