const mongoose = require('mongoose')

const ConnectDB = async() => {
   try{
    const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb connected successfully on host: ${conn.connection.host}`)
   }catch(err){
        console.error(err)
   }
}

module.exports = ConnectDB;