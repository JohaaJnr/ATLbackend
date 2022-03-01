const mongoose = require('mongoose')

const Category = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Categories', Category)