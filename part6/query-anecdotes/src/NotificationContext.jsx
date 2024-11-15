import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "CREATE":
        return `Created anecdote '${action.payload}'`
    case "VOTE":
        return `Voted anecdote '${action.payload}'`
    case "ERROR":
        return 'Anecdote is too short. Must have length 5 or more'
    case "RESET":
        return null
    default:
        return null
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext