const Discord = require("discord.js");
const money = require("../money.json");
const fs = require("fs");


module.exports.run = async (Client, message, args) => {

    let gambleEmbed = new Discord.MessageEmbed()

    if(message.author.bot) return;

    if(!money[message.author.id] || money[message.author.id].money <= 0) return message.reply("You don't have any cash!");

    if(!args[0]) return message.reply("Please specify the amount of cash you want to gamble.");

    try {
        var bet = parseFloat(args[0]);
    } catch {
        return message.reply("You can only enter whole integers.");
    }

    if(parseFloat(args[0]) < 1) return message.reply("You cannot gamble less than 1 cash!");

    if(bet != Math.floor(bet)) return message.reply("You can only enter whole integers.");

    if(money[message.author.id].money < bet) return message.reply("You don't have that much cash to gamble with!");

    let chances = ["Win", "Lose"];
    let pick = chances[Math.floor(Math.random() * chances.length)];

    if(pick == "Lose") {
        money[message.author.id].money -= bet;
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
        gambleEmbed.setTitle(`${message.author.username}'s Gambling Game`);
        gambleEmbed.addField("YOU LOST!", `New Balance: ${money[message.author.id].money} cash.`);
        gambleEmbed.setColor("#e63127");
        return message.reply(gambleEmbed);
    } else {
        jackpot = 1000
        const randomIndexJackpot = Math.floor(Math.random() * (jackpot - 1 + 1)) + 1;
        console.log(randomIndexJackpot)
        if(randomIndexJackpot == 439){
            money[message.author.id].money += 1000000;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
            let findLotteryRole = message.member.guild.roles.cache.find(d => d.name === "Lottery Winner");
            if(!findLotteryRole){
                message.member.guild.roles.create({
                    name: "Lottery Winner",
                    color: "#ffef12",
                    permissions: [],
                    mentionable: true,
                    position: 4,
                    hoist: true
                }).then(function(lotteryWinnerRole)
                {
                    message.member.roles.add(lotteryWinnerRole)
                });
            } else{
                message.member.roles.add(findLotteryRole)
            }
            

            
            gambleEmbed.setTitle(`${message.author.username}'s Gambling Game`);
            gambleEmbed.addField("JACKPOT!", `New Balance: ${money[message.author.id].money} cash.`);
            gambleEmbed.addField("NEW ROLE ASSIGNED!", 'Because of your win, you now have a new exclusive role!');
            gambleEmbed.setColor("#ffef12");
            return message.reply(gambleEmbed);
        } else {
            money[message.author.id].money += bet;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
            gambleEmbed.setTitle(`${message.author.username}'s Gambling Game`);
            gambleEmbed.addField("YOU WIN!", `New Balance: ${money[message.author.id].money} cash.`);
            gambleEmbed.setColor("#27e65a");
            return message.reply(gambleEmbed);


        }
        
    }


}

module.exports.help = {
    name: "gamble",
    aliases: []
}
