const mongoose = require('mongoose')
const SiteData = new mongoose.Schema({
 
    SiteName:{
        type: String,
        required: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Siteinfo', SiteData)