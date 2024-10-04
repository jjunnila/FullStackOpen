import { useState } from 'react'

const Filter = ({filter, update}) => {
  return (
    <div>Filter by name: <input value={filter} onChange={update}/></div>
  )
}

const Add = ({add, updateName, updateNumber, name, number}) => {
  return (
    <form onSubmit={add}>
      <div>name: <input value={name} onChange={updateName}/></div>
      <div>number: <input value={number} onChange={updateNumber}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({persons}) => {
  return (
    <div>
      {persons.map((person) => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [currentFilter, setFilter] = useState('')

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

  const updateFilterInput = (event) => {
    setFilter(event.target.value)
  }

  const filtered = persons.filter(person => person.name.toLowerCase().includes(currentFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={currentFilter} update={updateFilterInput}></Filter> 
      <h2>Add a new entry: </h2>
      <Add add={addPerson} updateName={updateNameInput} updateNumber={updateNumInput} name={newName} number={newNumber}></Add>
      <h2>Numbers: </h2>
      <Persons persons={filtered}></Persons>
    </div>
  )
}

export default App