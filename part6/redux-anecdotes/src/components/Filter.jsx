import { useDispatch } from 'react-redux'
import { filterBy } from '../reducers/filterReducer'

const Filter = () => {

    const dispatch = useDispatch()

    const handleChange = (event) => {
      event.preventDefault()
      dispatch(filterBy(event.target.value))
    }
    
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} />
      </div>
    )
  }
  
export default Filter