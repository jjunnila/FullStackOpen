const filterReducer = (state = '', action) => {

    console.log('filter state now: ', state)

    switch (action.type) {
        case 'FILTER':
            return action.payload
        default: 
            return state
        }
    }

export const filterBy = ( filter ) => {
    return {
        type: 'FILTER',
        payload: { filter }
    }
}

export default filterReducer