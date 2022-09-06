const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    exercise: [String],
    duration: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)