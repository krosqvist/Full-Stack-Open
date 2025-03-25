import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Person = ({ person, removePerson }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => removePerson(person.id, person.name)}>delete</button>
    </p>
  )
}

const Persons = ({ filteredPersons, removePerson }) => {
  return (
    <ul>
    {filteredPersons.map(person =>
      <Person key={person.name} person={person} removePerson={removePerson} />
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

const Success = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='success'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...existingPerson, number: newNumber}

        personService
          .update(existingPerson.id, updatedPerson)
          .then(retunedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person: retunedPerson))
            setSuccessMessage(`Modified ${newName}`)
            setTimeout(() => setSuccessMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => setErrorMessage(null), 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setSuccessMessage(`Added ${newName}`)
        setTimeout(() => setSuccessMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage(`Failed to add ${newName}`)
        setTimeout(() => setErrorMessage(null), 5000)
    })
    }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
      .remove(id)
      .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setSuccessMessage(`Deleted ${name}`)
          setTimeout(() => setSuccessMessage(null), 5000)
      })
      .catch(error => {
          setErrorMessage(`Information of ${name} has already been removed from server`)
          setTimeout(() => setErrorMessage(null), 5000)
          setPersons(persons.filter(person => person.id !== id))
      })
}
}

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )


  return (
    <div>
      <h2>Phonebook</h2>
        <Success message={successMessage} />
        <Error message={errorMessage} />
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
        <Persons
          filteredPersons={filteredPersons}
          removePerson={removePerson}/>
    </div>
  )
}

export default App