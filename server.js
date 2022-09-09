const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./user')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('dotenv').config()

mongoose.connect("mongodb+srv://MSTechFan:CityBarranquilla2022@cluster0.obgityr.mongodb.net/testdbs?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  await User.find().then(users => {
    res.send(users)
  })
})

app.get('/api/users/:id/logs', (req, res) => {
  
})

app.post('/api/users', async(req, res) => {
  const user = new User({"userName": req.body.username})
  try {
    await user.save()
    res.json({"username": user.userName, "_id": user._id})
  } catch(e){
    res.json({"username": "Username Invalid"})
  }
})

app.put('/api/users/:_id/exercises', async(req, res) => {
  const updatedUser = await User.findById(req.body.id)
  updatedUser.createdAt = req.body.date || Date.now()
  updatedUser.duration = req.body.duration
  updatedUser.exercise.push(req.body.description)
  updatedUser.save()
  res.json(updatedUser)
}) 

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})