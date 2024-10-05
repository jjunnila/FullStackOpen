import { useState } from 'react'
import axios from 'axios'

// THIS IS WORK IN PROGRESS
// I will get back to this later (maybe...)

const App = () => {

  const baseURL = "https://studies.cs.helsinki.fi/restcountries/api/name/"

  const [name, setName] = useState('') 

  const search = () => {
    const request = axios.get(`${baseURL}${name}`)
    return request.then(response => console.log(response.data))
  }

  return (
    <div>
      Find countries: 
      <input onChange={search} /> 
    </div>
  )
}

export default App