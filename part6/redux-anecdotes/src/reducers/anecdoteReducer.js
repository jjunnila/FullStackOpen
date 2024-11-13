import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../../services/anecdotes'

const compareLikesDescending = (first, second) => {
  if (first.votes === second.votes) 
    return 0
  return first.votes < second.votes ? 1 : -1
}

const anecdoteSlice = createSlice({
    name: 'anecdote',
    initialState: [],
    reducers:{
        voteOn(state, action) {
          return state.map((anecdote) => {return anecdote.id !== action.payload ? anecdote : {...anecdote, votes: anecdote.votes+1}}).sort(compareLikesDescending)
        },
        addNew(state, action) {
          state.push(action.payload)
        }, 
        setAnecdotes(state, action) {
          return action.payload.sort(compareLikesDescending)
        }
    }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const notes = await anecdoteService.getAll()
    dispatch(setAnecdotes(notes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(addNew(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.vote(anecdote)
    dispatch(voteOn(newAnecdote.id))
  }
}

export const { voteOn, addNew, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer