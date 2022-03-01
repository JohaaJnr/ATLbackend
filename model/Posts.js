const mongoose = require('mongoose')
const Posts = new mongoose.Schema({
    PostTitle: {
        type: String,
        required: true
    },
    PostCategory:{
        type: String,
        required: true
    },
    PostBody:{
        type: String,
        required: true
    },
    FeaturedImage: {
        type: String,
        required: true
    },
    Tags: {
        type: String
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Posts', Posts)