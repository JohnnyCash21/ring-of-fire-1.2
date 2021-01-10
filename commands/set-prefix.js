const commandPrefixSchema = require("../schemas/prefix-schema");
const mongo = require("./mongo");

module.exports.run = async (Client, message, args) => {
    if(!message.member.permissions.has(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to use this command! Only an `ADMINISTRATOR` is able to use this command.");
    let guild_prefix = args[0]
    if(!guild_prefix) return message.channel.send("Please specify an arguement for the new server prefix.");
    if(guild_prefix.length >= 10) return message.channel.send("Your prefix must be less than 10 characters");
    
    await mongo().then(async mongoose => {
        try {
            const guildId = message.guild.id

            await commandPrefixSchema.findOneAndUpdate({
                _id: guildId
            }, {
                _id: guildId,
                prefix: guild_prefix
            }, {
                upsert: true
            })

            message.reply(`:ok_hand: The prefix for this server is now: '${guild_prefix}'`);

        } finally{
            mongoose.connection.close()
        }
    })
   
}

module.exports.help = {
    name: "prefix",
    aliases: []
}
