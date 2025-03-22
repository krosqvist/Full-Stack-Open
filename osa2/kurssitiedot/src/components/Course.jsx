const Part = ({ part }) => {
  return (
      <p>
        {part.name} {part.exercises}
      </p>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    return sum + part.exercises
  }, 0)

  return <p><strong>Total of {total} exercises</strong></p>
}

const Course = ({ course }) => {
    return (
      <>
        <h2>{course.name}</h2>
        {course.parts.map(part =>
          <Part key={part.id} part={part} />
        )}
        <Total parts={course.parts} />
      </>
    )
  }

export default Course