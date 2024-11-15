import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const App = () => {

  const result = useQuery({queryKey: ['anecdotes'], queryFn: getAnecdotes, retry: 1})

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: updateAnecdote, 
    onSuccess: () => {queryClient.invalidateQueries({ queryKey: ['anecdotes'] })}
  })

  const [notification, dispatch] = useContext(NotificationContext)

  const handleVote = (anecdote) => {
    updateMutation.mutate({ ...anecdote, votes: anecdote.votes+1 })
    dispatch({type: 'VOTE', payload: anecdote.content})
  }

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>Anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
