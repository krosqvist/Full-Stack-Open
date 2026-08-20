import { useAnecdotes } from '../hooks/useAnecdotes'
import useNotify from '../hooks/useNotify'

const AnecdoteForm = () => {
  const { onCreate: addAnecdoteToServer } = useAnecdotes()
  const { showNotification } = useNotify()

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    try {
      await addAnecdoteToServer(content)
      showNotification(`anecdote ${content} added`)
      event.target.reset()
    } catch {
      showNotification('too short anecdote, must have length 5 or more')
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm