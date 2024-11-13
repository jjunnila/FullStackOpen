import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

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
          state.push(asObject(action.payload))
        }, 
        setAnecdotes(state, action) {
          return action.payload
        }
    }
})

export const { voteOn, addNew, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer