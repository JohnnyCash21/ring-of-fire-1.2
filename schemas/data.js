const mongoose = require('mongoose')


const dataSchema = mongoose.Schema({
    name: String,
    userId: String,
    lb: String,
    money: Number,
    daily: Number,
})

module.exports = mongoose.model('Data', dataSchema)
