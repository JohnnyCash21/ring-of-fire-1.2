const { GuildAuditLogs } = require("discord.js")

module.exports = Client => {
    const invites = {}

    const getInviteCounts = async (guild) => {
        return await new Promise(resolve => {
            guild.fetchInvites().then(invites => {
                const inviteCounter = {}

                invites.forEach(invite => {
                    const { uses, inviter } = invite
                    const { username, discriminator } = inviter

                    const name = `${username}#${discriminator}`

                    inviteCounter[name] = (inviteCounter[name] || 0) + uses


                });

                resolve(inviteCounter)
            })
        })

    }

    Client.guilds.cache.forEach(async (guild) => {
        invites[guild.id] = await getInviteCounts(guild);

    })

    Client.on("guildMemberAdd", async member => {
        const { guild } = member

        const invitesBefore = invites[guild.id]
        const invitesAfter = await getInviteCounts(guild)

        console.log('BEFORE:', invitesBefore);
        console.log('AFTER:', invitesAfter)

        for(const inviter in invitesAfter){
            if(invitesBefore[inviter] == undefined){
                invitesBefore[inviter] = 0
            }
            if(invitesBefore[inviter] === invitesAfter[inviter] - 1){
                const channel = guild.channels.cache.find(channel => channel.name === "general");
                if(!channel) return;
                const count = invitesAfter[inviter]
                channel.send(`Please welcome ${member} to the **${member.guild.name}** server! Please read the rules in the rules channel. \n Invited by **${inviter}** (${count} total invites)`)
                invites[guild.id] = invitesAfter
                return
            }
        }
    })
}

module.exports.help = {
    name: "",
    aliases: []
}
