import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {

  const queryClient = useQueryClient()

  const newMutation = useMutation({ 
    mutationFn: createAnecdote, 
    onSuccess: () => {queryClient.invalidateQueries({queryKey: ['anecdotes']})}
   })

   const [notification, dispatch] = useContext(NotificationContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    newMutation.mutate({ content, votes: 0 })
    dispatch({type: 'CREATE', payload: content})
    event.target.anecdote.value = ''
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
