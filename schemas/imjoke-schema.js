const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const imjokeSchema = mongoose.Schema({
    _id: reqString,
    channelId: reqString,
    text: reqString
})

module.exports = mongoose.model('im-joke', imjokeSchema)
