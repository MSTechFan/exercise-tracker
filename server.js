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
const testDate = new Date("2020-01-05").toDateString()
console.log(testDate)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  const userList = []
  await User.find().then(users => {
    users.forEach(user => {
      userList.push({"username": user.userName, "_id": user._id})
    })
  })
  res.send(userList)
})

app.get('/api/users/:id/logs', async (req, res) => {
  const user = await User.findById(req.params.id)
  
  res.json({
      "_id": user._id,
      "username": user.userName,
      "count": user.exercise.length,
      "log": user.exercise
  })
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
  const newExercise = {
    "description": req.body.description,
    "duration": req.body.duration,
    "date": new Date (req.body.date) || Date.now()
  }
  updatedUser.exercise.push(newExercise)
  updatedUser.save()
  res.json({
    "_id": req.body.id,
    "username": updatedUser.userName,
    "date": newExercise.date.toDateString(),
    "duration": newExercise.duration,
    "description": newExercise.description
  })
}) 

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})