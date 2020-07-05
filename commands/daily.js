const Discord = require("discord.js");
const fs = require("fs");
const money = require("../money.json");
const ms = require("parse-ms");
const cooldowns = require("../cooldowns.json");

module.exports.run = async (Client, message, args) => {

    let timeout = 86400000;    //86400000
    let reward = 500;

    let dailyEmbed = new Discord.RichEmbed();

    if(message.author.bot) return;
   
        
        
    dailyEmbed.setTitle('Daily Reward');

    if(!money[message.author.id]){
            

        money[message.author.id] = {
            name: Client.users.get(message.author.id).tag,
            money: reward
        }
                
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });

        if(!cooldowns[message.author.id]){
            cooldowns[message.author.id] = {
                name: Client.users.get(message.author.id).tag,
                daily: Date.now()
            }
            fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                if(err) console.log(err);
            });

        }else {
            cooldowns[message.author.id].daily = Date.now();
            fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                if(err) console.log(err);
            });


        }

        dailyEmbed.setDescription(`You collected your daily reward of ${reward} cash! Current balance is ${money[message.author.id].money} cash.`);
        dailyEmbed.setColor("#27e65a");
        return message.reply(dailyEmbed);



    } else {

        if(!cooldowns[message.author.id]){
            cooldowns[message.author.id] = {
                name: Client.users.get(message.author.id).tag,
                daily: Date.now()
            }
            fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                if(err) console.log(err);
            });

            money[message.author.id].money += reward;
            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });

            dailyEmbed.setDescription(`You collected your daily reward of ${reward} cash! Current balance is ${money[message.author.id].money} cash.`);
            dailyEmbed.setColor("#27e65a");
            return message.reply(dailyEmbed);



        } else {

            if(timeout - (Date.now() - cooldowns[message.author.id].daily) > 0){
    
                let time = ms(timeout - (Date.now() - cooldowns[message.author.id].daily));

                dailyEmbed.setColor("#e63127");
                dailyEmbed.setDescription(`**You already collected your daily reward. Come back later!**`);
                dailyEmbed.addField(`Collect again in`, `**${time.hours}h ${time.minutes}m ${time.seconds}s**`);
                return message.reply(dailyEmbed);


            }else {

                money[message.author.id].money += reward;
                fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                    if(err) console.log(err);
                });

                cooldowns[message.author.id].daily = Date.now();
                fs.writeFile("./cooldowns.json", JSON.stringify(cooldowns), (err) => {
                    if(err) console.log(err);
                });

                dailyEmbed.setDescription(`You collected your daily reward of ${reward} cash! Current balance is ${money[message.author.id].money} cash.`);
                dailyEmbed.setColor("#27e65a");
                return message.reply(dailyEmbed);

            }
        }           
    }    
}

module.exports.help = {
    name: "daily",
    aliases: []
}
