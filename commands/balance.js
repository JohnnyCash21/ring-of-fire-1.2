const fs = require("fs");
const money = require("../money.json");


module.exports.run = async (Client, message, args) => {

    if(!args[0]){
        var user = message.author;
    } else {
        var user = message.mentions.users.first() || Client.users.cache.get(args[0]);
    }


    if(!money[user.id]) {
        money[user.id] = {
            name: Client.users.get(user.id).tag,
            money: 0
        }
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err)
        });
    }


    return message.channel.send(`${Client.users.cache.get(user.id).username} has ${money[user.id].money} cash!`)
    

}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"]
}
