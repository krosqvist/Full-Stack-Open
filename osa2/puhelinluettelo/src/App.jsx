import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const Persons = ({ filteredPersons }) => {
  return (
    <ul>
    {filteredPersons.map(person =>
      <Person key={person.name} person={person} />
    )}
  </ul>
  )
}

const Filter = ({ filter, setFilter }) => {
  return (
    <>
      filter shown with
      <input
      value={filter}
      onChange={(e) => setFilter(e.target.value)}/>
    </>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <div>
        name:
        <input
        value={props.newName}
        onChange={(e) => props.setNewName(e.target.value)}/>
      </div>
      <div>
        number:
        <input
        value={props.newNumber}
        onChange={(e) => props.setNewNumber(e.target.value)}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])
  console.log('render', persons.length, 'notes')

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }
    const nameObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )


  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={filter} setFilter={setFilter}/>

      <h2>add a new</h2>
        <PersonForm
          addName={addName}
          newName={newName}
          setNewName={setNewName}
          newNumber={newNumber}
          setNewNumber={setNewNumber}
        />

      <h2>Numbers</h2>
        <Persons filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App