const Header = ({name}) => {
  console.log(name)
  return (<h1>{name}</h1>)
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => <Part part={part}></Part>)}
    </div>
  )
}

const Part = ({part}) => {
  console.log(part)
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Course = ({course}) => {
  return (
    <div>
        <Header name={course.name}></Header>
        <Content parts={course.parts}></Content>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App