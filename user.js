const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    exercise: [String],
    duration: Number,
    createdAt: Date
})

module.exports = mongoose.model('User', userSchema)