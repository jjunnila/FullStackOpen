import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers:{
        notifyCreation(state, action) {
            return `Added new anecdote: '${action.payload}'`
        }, 
        notifyVote(state, action) {
            return `You voted on '${action.payload}'`
        },
        reset() {
            return null
        }
    }
})

export const { notifyCreation, notifyVote, reset } = notificationSlice.actions
export default notificationSlice.reducer