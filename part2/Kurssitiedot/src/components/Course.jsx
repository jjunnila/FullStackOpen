const Header = ({name}) => {
    console.log(name)
    return (<h2>{name}</h2>)
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => <Part key={part.id} part={part}></Part>)}
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
  
  const Total = ({parts}) => {
    const total = parts.reduce((sum, current) => sum+current.exercises, 0)
    console.log(total)
    return (
      <b>Total of {total} exercises </b>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
          <Header name={course.name}></Header>
          <Content parts={course.parts}></Content>
          <Total parts={course.parts}></Total>
      </div>
    )
  }

  export default Course