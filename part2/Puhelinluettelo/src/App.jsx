import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "040-1234567"}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log(newName);
    const newPerson = { name: newName, number: newNumber }
    if (persons.some(person => person.name === newPerson.name))
        alert(`${newName} is already added to phonebook`)
    else {
      setPersons(persons.concat(newPerson))
      setNewName("")
      setNewNumber("")
    }
  }

  const updateNameInput = (event) => {
    setNewName(event.target.value)
  }

  const updateNumInput = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={updateNameInput}/></div>
        <div>number: <input value={newNumber} onChange={updateNumInput}/></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
        {persons.map((person) => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )

}

export default App