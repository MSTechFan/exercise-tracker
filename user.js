const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    exercise: [{
        description: String,
        duration: Number,
        date: Date
    }]
})

/* userSchema.pre('validate', function(next) {
    if(this.exercise.date){
        this
    }
    next()
}) */

module.exports = mongoose.model('User', userSchema)