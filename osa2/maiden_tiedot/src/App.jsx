import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const api_key = import.meta.env.VITE_SOME_KEY

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const Country = ({ country, setFilter }) => {
  return (
    <p>
      {country.name.common}
      <button onClick={() => setFilter(country.name.common)}>Show</button>
    </p>
  )
}

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const weatherIcon = ``

  useEffect(() => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`

    axios.get(weatherUrl)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => console.error('Error fetching weather data', error))
  }, [country.capital])

  console.log(weather)

  return (
    <>
    <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

    <h2>Languages</h2>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
    
    <p>
      <img src={country.flags.png} />
    </p>

      {weather && (
        <>
          <h2>Weather in {country.capital[0]}</h2>
          <p>Temperature: {weather.main.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} />
          <p>Wind: {weather.wind.speed} m/s</p>
        </>
      )}
    </>
  )
}

const Countries = ({ filteredCountries, setFilter }) => {
  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
    return (
      <ul>
      {filteredCountries.map(country =>
        <Country key={country.cca3} country={country} setFilter={setFilter} />
      )}
    </ul>
    )}


  return (
    <ul>
    {filteredCountries.map(country =>
      <CountryDetail
        key={country.cca3}
        country={country}
      />
    )}
  </ul>
  )
}

const Filter = ({ filter, setFilter }) => {
  return (
    <>
      find countries
      <input
      value={filter}
      onChange={(e) => setFilter(e.target.value)}/>
    </>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getAll()
    .then(initialCountries => {
      setCountries(initialCountries)
    })
    .catch(error => console.error('Error fetching the countries', error))
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <Countries filteredCountries={filteredCountries} setFilter={setFilter} />
    </div>
  )

}



export default App