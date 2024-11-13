import { useDispatch } from 'react-redux'
import { addNew } from '../reducers/anecdoteReducer'
import { notifyCreation, reset } from '../reducers/notificationReducer'
import anecdoteService from '../../services/anecdotes'

const AnecdoteForm = () => {

    const dispatch = useDispatch()

    const add = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(addNew(newAnecdote))
        dispatch(notifyCreation(content))
        setTimeout(() => {
            dispatch(reset())
          }, 5000)
      }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={add}>
                <div><input name="anecdote" /></div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm