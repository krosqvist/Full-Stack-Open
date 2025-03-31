let object1 = {
    name: 'Arto Hellas',
    age: 35,
    education: 'Filosofian tohtori',
  }
  
  let object2 = {
    name: 'Full Stack -websovelluskehitys',
    level: 'aineopinto',
    size: 5,
  }
  
  let object3 = {
    name: {
      first: 'Juha',
      last: 'Tauriainen',
    },
    grades: [2, 3, 5, 3],
    department: 'TKTL',
  }

  console.log(object1.name)         // tulostuu Arto Hellas
  const fieldName = 'age' 
  console.log(object1[fieldName])    // tulostuu 35