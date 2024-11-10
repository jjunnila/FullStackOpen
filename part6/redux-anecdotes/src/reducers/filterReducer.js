import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers:{
        filterBy(state, action) {
            return action.payload
        }
    }
})

export const { filterBy } = filterSlice.actions
export default filterSlice.reducer