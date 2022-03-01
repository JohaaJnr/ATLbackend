const mongoose = require('mongoose')
const Menus = new mongoose.Schema({
    Menu:{
        type: String,
        required: true
    },
    CreatedAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Menus', Menus)