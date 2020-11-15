const money = require("../money.json");
const fs = require("fs");

module.exports.run = async (Client, message, args) => {
    
    if(message.author.bot) return;

    let user = message.mentions.members.first() || Client.users.cache.get(args[0]);
    if(!user) return message.reply("Sorry, couldn't find that user.");

    if(!args[1]) return message.reply("Please specify the amount you want to rob.");

    
    if(!money[message.author.id]) return message.reply("Sorry, you don't have any cash.");
    if(money[message.author.id].money < 750) return message.reply("You need 750 or more cash to rob");

    if(parseInt(args[1]) > money[message.author.id].money) return message.reply("You do not have enough cash!");
    if(parseInt(args[1]) < 1) return message.reply("You cannot rob less than 1 cash!");
    if(parseInt(args[1]) > 7000) return message.reply("You cannot rob more than 7000 cash!");
    if(!parseInt(args[1])) return message.reply("You can only rob in integers.");

    if(!money[user.id]) {
        
        return message.channel.send("This person has no money!")
    } else {
        if(money[user.id].money < args[1]) return message.reply("This person doesn't have that much cash");

        const chance = Math.floor(Math.random() * 2);
        
        if(chance == 0){
            money[user.id].money -= parseInt(args[1]);
            money[message.author.id].money += parseInt(args[1]);
        }else{
            money[user.id].money += 500;
            money[message.author.id].money -= 500;
            return message.channel.send("You got caught! You had to pay a fine of 500 cash to the other user.")

        }
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err);
        });

        
    }

    return message.channel.send(`${message.author.username} robbed ${args[1]} cash from ${Client.users.cache.get(user.id)}!`);



}

module.exports.help = {
    name: "rob",
    aliases: []
}
