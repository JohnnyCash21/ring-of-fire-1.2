const money = require("../money.json");
const mongo = require("./mongo")

const Data = require("../schemas/data")

module.exports.run = async (Client, message, args) => {

    if(!args[0]){
        var user = message.author;
    } else {
        var user = message.mentions.users.first() || Client.users.cache.get(args[0]);
    }

    await mongo().then(async (mongoose) => {
        try {
            await Data.findOne({
                userId: user.id
            }, (err, data) => {
                if(err) console.log(err);
                if(!data){
                    const newData = new Data({
                        name: Client.users.cache.get(user.id).username,
                        userId: user.id,
                        lb: "all",
                        money: 0,
                        daily: 0,
                    })
                    newData.save().catch(err => console.log(err));
                    message.channel.send(`${Client.users.cache.get(user.id).username} has 0 cash.`)
                } else {
                    message.channel.send(`${Client.users.cache.get(user.id).username} has ${data.money} cash.`)
                }
            })

        } finally {
            mongoose.connection.close()
        }
    })
    

}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"]
}
