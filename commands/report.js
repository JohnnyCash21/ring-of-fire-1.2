const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports.run = async (Client, message, args) => {
    if(!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send("I do not have permissions to send embedded messages. Please enable the `EMBED_LINKS` option on me.");
    if(message.deletable) message.delete();

    let rMember = message.mentions.members.first() || message.guild.members.fetch(args[0]);
    

    if(!args[0]) return message.reply("Couldn't find the person you are looking for. \nRemember to use the command as so: `!report (user) (reason)`").then(m => m.delete({ timeout: 5000 }));

    try{
        if(rMember.permissions.has("KICK_MEMBERS") || rMember.user.bot){
            return message.reply("I wasn't able to report this user.").then(m => m.delete({ timeout: 5000 }))
        }
    }
    catch(err){
        return message.channel.send("An error occurred! Are you trying to do something you're not supposed to?")

    }
    

    if(!args[1]){
        return message.channel.send("Please provide a reason for me to report this user! \nRemember to use the command as so: `!report (user) (reason)`").then(m => m.delete({ timeout: 5000 }));
    }

    const channel = message.guild.channels.cache.find(channel => channel.name === "reports");

    if(!channel) return message.channel.send("Please create a `reports` channel before using this command").then(m => m.delete({ timeout: 5000 }));

    const embed = new MessageEmbed()
        .setColor("#d1271b")
        .setTimestamp()
        .setFooter(message.guild.name, message.guild.iconURL())
        .setAuthor("Reported Member", rMember.user.displayAvatarURL())
        .setDescription(stripIndents`**- Member:** ${rMember} (${rMember.id})
        \n**- Reported by:** ${message.member} (${message.member.id})
        \n**- Reported in:** ${message.channel}
        \n**- Reason:** ${args.slice(1).join(" ")}`);
    
    message.channel.send("Successfuly sent report!")
    return channel.send(embed)
}

module.exports.help = {
    name: "report",
    aliases: []
}
