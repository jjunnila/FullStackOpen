import { useState } from 'react'

const Statistics = (props) => {
  if (props.good > 0 || props.neutral > 0 || props.bad > 0){
    const all = props.good + props.neutral + props.bad
    const average = (props.good - props.bad)/all
    const positive = props.good/all*100
    return (
      <table>
        <tbody>
          <StatisticLine text='Good' value={props.good}/>
          <StatisticLine text='Neutral' value={props.neutral}/>
          <StatisticLine text='Bad' value={props.bad}/>
          <StatisticLine text='All' value={all}/>
          <StatisticLine text='Average' value={average}/>
          <StatisticLine text='Positive' value={positive} percent='%'/>
        </tbody>
      </table>
    )
  } else {
    return <p>No feedback given</p>
  }
  
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}: </td>  
      <td>{props.value} {props.percent}</td>
    </tr>
  )
}

const Button = (props) => {
  return (
    <button onClick={() => {props.setter(props.amount+1)}}>{props.name}</button>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1> Give feedback! </h1>
      <Button name='Good' amount={good} setter={setGood} />
      <Button name='Neutral' amount={neutral} setter={setNeutral} />
      <Button name='Bad' amount={bad} setter={setBad} />
      <h1> Statistics: </h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App