import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers:{
        notification(state, action) {
            return action.payload
        }, 
        reset() {
            return null
        }
    }
})

export const notify = (content, duration) => {
    return dispatch => {
        dispatch(notification(content))
        setTimeout(() => {
            dispatch(reset())
          }, duration*1000)
    }
  }

export const { notification, reset } = notificationSlice.actions
export default notificationSlice.reducer