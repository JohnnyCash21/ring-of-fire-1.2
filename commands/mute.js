const redis = require('./redis');
const ms = require('ms')

module.exports.run = async (Client, message, args) => {
    const redisKeyPrefix = "muted-"

    redis.expire(message => {
        if(message.startsWith(redisKeyPrefix)){
            const split = message.split('-')

            const guildId = split[2]
            const memberId = split[1]
            const guild = Client.guilds.cache.get(guildId)
            const member = guild.members.cache.get(memberId)
            if(member){
                const role = guild.roles.cache.find(role => role.name === "Muted")
                if(role){
                    member.roles.remove(role)
                }
            }
        }
    })

    const giveRole = member => {
        const role = member.guild.roles.cache.find(role => role.name === "Muted")
            if(role){
                if(member.roles.cache.find(role => role.name === "Muted")){
                    return message.channel.send("This user is already muted!")
                }else{
                    member.roles.add(role)
                    return message.channel.send("Successfully muted!")
                }
            }else{
                return message.channel.send("Could not find a `Muted` role. Please create one before trying to mute someone.")
            }
    }

    const onJoin = async member => {
        const { id, guild } = member

        const redisClient = await redis()
        try {
            redisClient.get(`${redisKeyPrefix}${id}-${guild.id}`, (err, result) => {
                if (err){
                    console.log('Redis GET error:', err)
                } else if (result){
                    const role = guild.roles.cache.find(role => role.name === "Muted")
                    if(role){
                        member.roles.add(role)
                    }

                }
            })

        } finally{
            redisClient.quit()
        }
        
    }
    Client.on('guildMemberAdd', member => {
        onJoin(member)
    })

    const { member, content, channel, mentions, guild } = message

    const syntax = "`!mute <member> <time-frame>` The time frame can be used as `30s`, `5m`, `2h`, `1d`, etc."

    if(!member.permissions.has(["MANAGE_ROLES"])) return message.channel.send("You do not have permission to run this command!");
    if(!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send("I do not have permissions to manage roles. Please enable the `MANAGE_ROLES` option on me.");

    const split = content.trim().split(' ');
    if (split.length !== 3){
        return channel.send(`Please use the correct command syntax: ${syntax}`);
    }

    let timeFrame = ms(args[1])
    if(!timeFrame) return channel.send(`Please use the correct command syntax: ${syntax}`);
    timeFrame = timeFrame / 1000
    if(timeFrame < 1) return channel.send("Unable to insert time frame of less than 1 second.");

    const target = mentions.users.first()
    if(!target) return channel.send(`Please specify a user to mute. \n${syntax}`);

    const { id } = target

    const targetMember = guild.members.cache.get(id)
    giveRole(targetMember)

    const redisClient = await redis()
    try {
        const redisKey = `${redisKeyPrefix}${id}-${guild.id}`

        redisClient.set(redisKey, 'true', "EX", timeFrame)


    } finally {
        redisClient.quit()

    }

}

module.exports.help = {
    name: "mute",
    aliases: []
}
