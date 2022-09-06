const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./user')
const bodyParser = require('body-parser')
require('dotenv').config()

mongoose.connect("mongodb+srv://MSTechFan:CityBarranquilla2022@cluster0.obgityr.mongodb.net/testdbs?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', (req, res) => {
  const foundUsers = User.find().then(users => {
    res.send(foundUsers)
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


app.post('/api/users/:_id/exercises', (req, res) => {
  
}) 


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
