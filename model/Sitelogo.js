const mongoose = require('mongoose')
const Logo = new mongoose.Schema({
    Logo: {
        type: String,
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Logo', Logo)