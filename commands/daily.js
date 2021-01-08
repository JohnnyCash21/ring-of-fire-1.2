const Discord = require("discord.js");
const ms = require("parse-ms");
const mongo = require("./mongo")

const Data = require("../schemas/data")

module.exports.run = async (Client, message, args) => {

    let timeout = 86400000;    //86400000
    let reward = 500;

    let dailyEmbed = new Discord.MessageEmbed();

    if(message.author.bot) return;
        
    dailyEmbed.setTitle('Daily Reward');

    await mongo().then(async (mongoose) => {
        try {
            await Data.findOne({
                userId: message.author.id
            }, (err, data) => {
                if(err) console.log(err);
                if(!data){
                    const newData = new Data({
                        name: message.author.username,
                        userId: message.author.id,
                        lb: "all",
                        money: reward,
                        daily: Date.now(),
                    })
                    newData.save().catch(err => console.log(err));
                    message.channel.send(`${message.author.username} has ${reward} cash.`)
                } else {
                    if(timeout - (Date.now() - data.daily) > 0){
                        let time = ms(timeout - (Date.now() - data.daily));

                        dailyEmbed.setColor("#e63127");
                        dailyEmbed.setDescription(`**You already collected your daily reward. Come back later!**`);
                        dailyEmbed.addField(`Collect again in`, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
                        return message.reply(dailyEmbed);

                    } else{
                        data.money += reward;
                        data.daily = Date.now();
                        data.save().catch(err => console.log(err));

                        dailyEmbed.setDescription(`You collected your daily reward of ${reward} cash! Current balance is ${data.money} cash.`);
                        dailyEmbed.setColor("#27e65a");
                        return message.reply(dailyEmbed);

                    }
                }
            })

        } finally {
            //mongoose.connection.close()
        }
    })

    
}

module.exports.help = {
    name: "daily",
    aliases: []
}
