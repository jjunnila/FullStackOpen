import { useState, useEffect } from 'react'
import personsService from './services/persons'

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

const Persons = ({persons, setPersons}) => {
  return (
    <div>
      {persons.map((person) => 
        <p key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deleteHandler(person.name, person.id, persons, setPersons)}>delete</button>
        </p>)}
    </div>
  )
}

const deleteHandler = (name, id, persons, setPersons) => {
  if (window.confirm(`Delete ${name}?`)){
    personsService
      .remove(id)
      .then(response => setPersons(persons.filter(person => person.id !== id)))
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [currentFilter, setFilter] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log(newName);
    const newPerson = { name: newName, number: newNumber }
    if (persons.some(person => person.name === newPerson.name)){
      const id = persons.find((person) => person.name === newPerson.name).id
      console.log(id)
      if (window.confirm(`${newPerson.name} is already added to the phonebook, replace old number?`)){
        personsService
          .update(id, {name: newPerson.name, number: newPerson.number, id: id})
          //.then(response => console.log(response))
          .then(response => {setPersons(persons.map(person => person.id === id ? response : person))})
          console.log(persons)
          setNewName("")
          setNewNumber("")
      }
    }
    else {
      personsService
        .create(newPerson)
        .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
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

  //console.log("Persons before filtering ", persons)
  const filtered = persons.filter(person => person.name.toLowerCase().includes(currentFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={currentFilter} update={updateFilterInput}></Filter> 
      <h2>Add a new entry: </h2>
      <Add add={addPerson} updateName={updateNameInput} updateNumber={updateNumInput} name={newName} number={newNumber}></Add>
      <h2>Numbers: </h2>
      <Persons persons={filtered} setPersons={setPersons}></Persons>
    </div>
  )
}

export default App