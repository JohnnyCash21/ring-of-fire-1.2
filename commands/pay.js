const money = require("../money.json");
const fs = require("fs");

module.exports.run = async (Client, message, args) => {
    
    if(message.author.bot) return;

    let user = message.mentions.members.first() || Client.users.cache.get(args[0]);
    if(!user) return message.reply("Sorry, couldn't find that user.");

    if(!args[1]) return message.reply("Please specify the amount you want to pay.");

    
    if(!money[message.author.id]) return message.reply("Sorry, you don't have any money.");

    if(parseInt(args[1]) > money[message.author.id].money) return message.reply("You do not have enough cash!");
    if(parseInt(args[1]) < 1) return message.reply("You cannot pay less than 1 cash!");
    if(!parseInt(args[1])) return message.reply("You can only pay in integers.");

    if(!money[user.id]) {
        
        money[user.id] = {
            name: Client.users.cache.get(user.id).tag,
            money: parseInt(args[1])
        }

        money[message.author.id].money -= parseInt(args[1]);

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    } else {

        money[user.id].money += parseInt(args[1]);

        money[message.author.id].money -= parseInt(args[1]);

        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });
    }

    return message.channel.send(`${message.author.username} payed ${args[1]} cash to ${Client.users.cache.get(user.id)}!`);



}

module.exports.help = {
    name: "pay",
    aliases: []
}
