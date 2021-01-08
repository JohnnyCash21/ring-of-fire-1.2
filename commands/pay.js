const mongo = require("./mongo")

const Data = require("../schemas/data")

module.exports.run = async (Client, message, args) => {
    
    if(message.author.bot) return;

    let user = message.mentions.members.first() || Client.users.cache.get(args[0]);
    if(!user) return message.reply("Sorry, couldn't find that user.");

    if(user.id === message.author.id) return message.reply("You can't pay yourself!")

    await mongo().then(async (mongoose) => {
        try {
            Data.findOne({
                userId: message.author.id
            }, (err, authorData) => {
                if(err) console.log(err);
                if(!authorData){
                    message.reply("You have no cash to pay with!")
                } else {
                   Data.findOne({
                        userId: user.id
                    }, (err, userData) => {
                        if(err) console.log(err);
                        if(!args[1]) return message.reply("Please specify the amount you want to pay.");

                        if(parseInt(args[1]) > authorData.money) return message.reply("You do not have enough cash!");
                        if(parseInt(args[1]) < 1) return message.reply("You cannot pay less than 1 cash!");
                        if(!parseInt(args[1])) return message.reply("You can only pay in integers.");
                        if(!userData){
                            const newData = new Data({
                                name: Client.users.cache.get(user.id).username,
                                userId: user.id,
                                lb: "all",
                                money: parseInt(args[1]),
                                daily: 0,
                            })
                            authorData.money -= parseInt(args[1])
                            newData.save().catch(err => console.log(err));
                            authorData.save().catch(err => console.log(err));

                        }else{
                            userData.money += parseInt(args[1])
                            authorData.money -= parseInt(args[1])
                            userData.save().catch(err => console.log(err));
                            authorData.save().catch(err => console.log(err));
                        }

                        return message.channel.send(`${message.author.username} payed ${args[1]} cash to ${Client.users.cache.get(user.id)}!`);
                    })
                }
            })

        } finally {
            //mongoose.connection.close()
        }
    })

}

module.exports.help = {
    name: "pay",
    aliases: []
}
