const Discord = require("discord.js");
const mongo = require("./mongo")

const Data = require("../schemas/data")

module.exports.run = async (Client, message, args) => {

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
                        money: 0,
                        daily: 0,
                    })
                    newData.save().catch(err => console.log(err));
                    message.reply("You have no cash to gamble with!")
                }else{
                    let gambleEmbed = new Discord.MessageEmbed()

                    if(message.author.bot) return;

                    if(data.money <= 0) return message.reply("You don't have any cash!");

                    if(!args[0]) return message.reply("Please specify the amount of cash you want to gamble.");

                    try {
                        var bet = parseFloat(args[0]);
                    } catch {
                        return message.reply("You can only enter whole integers.");
                    }

                    if(parseFloat(args[0]) < 1) return message.reply("You cannot gamble less than 1 cash!");

                    if(bet != Math.floor(bet)) return message.reply("You can only enter whole integers.");

                    if(data.money < bet) return message.reply("You don't have that much cash to gamble with!");

                    let chances = ["Win", "Lose"];
                    let pick = chances[Math.floor(Math.random() * chances.length)];

                    if(pick == "Lose") {
                        data.money -= bet;
                        data.save().catch(err => console.log(err));
                        gambleEmbed.setTitle(`${message.author.username}'s Gambling Game`);
                        gambleEmbed.addField("YOU LOST!", `New Balance: ${data.money} cash.`);
                        gambleEmbed.setColor("#e63127");
                        return message.reply(gambleEmbed);
                    } else {
                        jackpot = 1000
                        const randomIndexJackpot = Math.floor(Math.random() * (jackpot - 1 + 1)) + 1;
                        console.log(randomIndexJackpot)
                        if(randomIndexJackpot == 439){
                            data.money += 1000000;
                            data.save().catch(err => console.log(err));
                            
                            gambleEmbed.setTitle(`${message.author.username}'s Gambling Game`);
                            gambleEmbed.addField("JACKPOT!", `New Balance: ${data.money} cash.`);
                            gambleEmbed.setColor("#ffef12");
                            return message.reply(gambleEmbed);
                        } else {
                            data.money += bet;
                            data.save().catch(err => console.log(err));
                            gambleEmbed.setTitle(`${message.author.username}'s Gambling Game`);
                            gambleEmbed.addField("YOU WIN!", `New Balance: ${data.money} cash.`);
                            gambleEmbed.setColor("#27e65a");
                            return message.reply(gambleEmbed);

                        }
                        
                    }

                }
                
            })

        } finally {
            console.log("Closing connecttion")
            //mongoose.connection.close()
        }
    })

    


}

module.exports.help = {
    name: "gamble",
    aliases: []
}
