import { useState } from 'react'

const Statistics = (props) => {
  if (props.good > 0 || props.neutral > 0 || props.bad > 0){
    const all = props.good + props.neutral + props.bad
    const average = (props.good - props.bad)/all
    const positive = props.good/all*100
    return (
      <p>
        Good: {props.good}<br/>
        Neutral: {props.neutral}<br/>
        Bad: {props.bad}<br/>
        All: {all}<br/>
        Average: {average}<br/>
        Positive: {positive} %<br/>
      </p>
    )
  } else {
    return <p>No feedback given</p>
  }
  
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
    console.log('Set good value: ', good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral+1)
    console.log('Set neutral value: ', neutral+1)
  }

  const handleBad = () => {
    setBad(bad+1)
    console.log('Set bad value: ', bad+1)
  }

  return (
    <div>
      <h1> Give feedback! </h1>
      <button onClick={handleGood}>Good</button>
      <button onClick={handleNeutral}>Neutral</button>
      <button onClick={handleBad}>Bad</button>
      <h1> Statistics: </h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App