import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text} {props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="total" value={props.total} />
      <StatisticLine text="average" value={props.average} />
      <StatisticLine text="positive" value={`${props.positive} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    const newTotal = updatedGood + neutral + bad
    setGood(updatedGood)
    setTotal(newTotal)
    setAverage((updatedGood - bad) / newTotal)
    setPositive((updatedGood / newTotal) * 100)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    const newTotal = good + updatedNeutral + bad
    setNeutral(updatedNeutral)
    setTotal(newTotal)
    setAverage((good - bad) / newTotal)
    setPositive((good / newTotal) * 100)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    const newTotal = good + neutral + updatedBad
    setBad(updatedBad)
    setTotal(newTotal)
    setAverage((good - updatedBad) / newTotal)
    setPositive((good / newTotal) * 100)
  }

  return (
    <div>
      <h1>give feedback</h1>
        <Button onClick={handleGoodClick} text="good" />
        <Button onClick={handleNeutralClick} text="neutral" />
        <Button onClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          average={average}
          positive={positive}
        />
    </div>
  )
}

export default App