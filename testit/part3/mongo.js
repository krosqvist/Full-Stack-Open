const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://krosqvist1:${password}@cluster0.xtbuvxu.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'the first note is about HTTP methods',
  important: false,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

