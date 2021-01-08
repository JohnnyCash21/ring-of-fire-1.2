const mongo = require("./mongo")

const Data = require("../schemas/data")

module.exports.run = async (Client, message, args) => {
    
    if(message.author.bot) return;

    let user = message.mentions.members.first() || Client.users.cache.get(args[0]);
    if(!user) return message.reply("Sorry, couldn't find that user.");

    if(user.id === message.author.id) return message.reply("You can't rob yourself!")

    await mongo().then(async (mongoose) => {
        try {
            await Data.findOne({
                userId: message.author.id
            }, (err, authorData) => {
                if(err) console.log(err);
                if(!authorData || authorData.money < 750){
                    return message.reply("You need atleast 750 cash to rob!")
                } else {
                    Data.findOne({
                        userId: user.id
                    }, (err, userData) => {
                        if(err) console.log(err);
                        if(!args[1]) return message.reply("Please specify the amount you want to rob.");

                        if(parseInt(args[1]) < 1) return message.reply("You cannot rob less than 1 cash!");
                        if(parseInt(args[1]) > 7000) return message.reply("You cannot rob more than 7000 cash!");
                        if(!parseInt(args[1])) return message.reply("You can only rob in integers.");

                        if(!userData || userData.money < parseInt(args[1])){
                            return message.reply("This person doesn't have that much money!")

                        }else{
                            const chance = Math.floor(Math.random() * 2);
                            if(chance == 0){
                                userData.money -= parseInt(args[1]);
                                authorData.money += parseInt(args[1]);
                                userData.save().catch(err => console.log(err));
                                authorData.save().catch(err => console.log(err));
                            }else{
                                userData.money += 500;
                                authorData.money -= 500;
                                userData.save().catch(err => console.log(err));
                                authorData.save().catch(err => console.log(err));
                                return message.channel.send("You got caught! You had to pay a fine of 500 cash to the other user.")

                            }
                            return message.channel.send(`${message.author.username} robbed ${args[1]} cash from ${Client.users.cache.get(user.id)}!`);
                        }
                    })
                }
            })

        } finally {
            //mongoose.connection.close()
        }
    })


}

module.exports.help = {
    name: "rob",
    aliases: []
}
