import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({notification}) => {
    if (notification === null) 
        return null
    return notification
  })
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (notification !== null)
    return (
      <div style={style}>
        {notification}
      </div>
    )
  return null
}

export default Notification