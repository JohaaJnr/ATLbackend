const mongoose = require('mongoose')
const User = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    UserEmail: {
        type: String,
        required: true
    },
    UserPass: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', User)