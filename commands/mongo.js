const mongoose = require('mongoose')
const mongoPath = process.env.MONGO_URL || "mongodb://localhost/discordBot_db"

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}

module.exports.help = {
    name: "",
    aliases: []
}
