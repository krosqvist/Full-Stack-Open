import { useAnecdotes } from './hooks/useAnecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import Anecdotes from './components/Anecdotes'

const App = () => {
  const { isPending, isError, error } = useAnecdotes()

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <span>anecdote service is not available due to problems in server. Error: {error.message}</span>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />
      <Anecdotes />
    </div>
  )
}

export default App