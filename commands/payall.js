const money = require("../money.json");
const fs = require("fs");

module.exports.run = async (Client, message, args) => {
    
    if(message.author.bot) return;

    const { guild } = message

    const { memberCount } = guild

    if(!args[0]) return message.reply("Please specify the amount you want to pay.");

    
    if(!money[message.author.id]) return message.reply("Sorry, you don't have any money.");

    if(money[message.author.id].money < args[0] * memberCount -1) return message.reply("Sorry, you don't have enough cash!")    

    if(parseInt(args[0]) > money[message.author.id].money) return message.reply("You do not have enough cash!");
    if(parseInt(args[0]) < 1) return message.reply("You cannot pay less than 1 cash!");
    if(!parseInt(args[0])) return message.reply("You can only pay in integers.");

    const server = message.member.guild;

    server.members.cache.forEach(member => {
        
        if(!money[member.user.id] && member.user.id != message.author.id) {
        
            money[member.user.id] = {
                name: Client.users.cache.get(member.user.id).tag,
                money: parseInt(args[0])
            }

            money[message.author.id].money -= parseInt(args[0]);

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
        } else if(money[member.user.id] && member.user.id != message.author.id){

            money[member.user.id].money += parseInt(args[0]);

            money[message.author.id].money -= parseInt(args[0]);

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
        }
    });

    return message.channel.send(`${message.author.username} payed ${args[0]} cash to the whole server!`);

}

module.exports.help = {
    name: "payall",
    aliases: []
}    
