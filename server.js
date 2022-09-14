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


// Query to get all users created and their ID
app.get('/api/users', async (req, res) => {
  const userList = []
  await User.find().then(users => {
    users.forEach(user => {
      userList.push({"username": user.userName, "_id": user._id})
    })
  })
  res.send(userList)
})



// Query to get all the logs with username, ID, exercises.
// The query can search FROM one date TO another, and can return a LIMIT of responses
app.get('/api/users/:id/logs', async(req, res) => {
  const {id} = req.params
  const {from, to, limit} = req.query
  User.findById(id, (error, result) => {
    if(!error){
      let logsArray = JSON.parse(JSON.stringify(result.exercise))
      
      logsArray = logsArray.map(object  => {
        object.date = new Date(object.date)
        return object
      })

      if(from)logsArray = logsArray.filter(object => object.date >= new Date(from))

      if(to)logsArray = logsArray.filter(object => object.date <= new Date(to))

      if(limit)logsArray = logsArray.slice(0, limit)
      
      logsArray = logsArray.map(object  => {
        object.date = object.date.toDateString()
        return object
      }) 

      const resObject = {
        "id": id,
        "username": result.userName,
        "from": from,
        "to": to,
        "count": logsArray.length,
        "logs": logsArray
      }

      res.json(resObject)
    } else {
      res.send("Error finding information")
    }
  })
})


// Query to create a new User
app.post('/api/users', async(req, res) => {
  const user = new User({"userName": req.body.username})
  try {
    await user.save()
    res.json({"username": user.userName, "_id": user._id})
  } catch(e){
    res.json({"username": "Username Invalid"})
  }
})

// Query to add an exercise, duration, and date to an especific user, using their ID
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