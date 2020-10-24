const { RichEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports.run = async (Client, message, args) => {
    if(message.deletable) message.delete();

    let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

    if(!rMember) return message.reply("Couldn't find the person you are looking for. \nRemember to use the command as so: `!report (user) (reason)`").then(m => m.delete(5000));

    if(rMember.hasPermission("KICK_MEMBERS") || rMember.user.bot){
        return message.reply("I wasn't able to report this user.").then(m => m.delete(5000))
    }

    if(!args[1]){
        return message.channel.send("Please provide a reason for me to report this user! \nRemember to use the command as so: `!report (user) (reason)`").then(m => m.delete(5000));
    }

    const channel = message.guild.channels.find(channel => channel.name === "reports");

    if(!channel) return message.channel.send("Please create a `reports` channel before using this command").then(m => m.delete(5000));

    const embed = new RichEmbed()
        .setColor("#d1271b")
        .setTimestamp()
        .setFooter(message.guild.name, message.guild.iconURL)
        .setAuthor("Reported Member", rMember.user.displayAvatarURL)
        .setDescription(stripIndents`**- Member:** ${rMember} (${rMember.id})
        **- Reported by:** ${message.member} (${message.member.id})
        **- Reported in:** ${message.channel}
        **- Reason:** ${args.slice(1).join(" ")}`);
    
    message.channel.send("Successfuly sent report!")
    return channel.send(embed)
}

module.exports.help = {
    name: "report",
    aliases: []
}
