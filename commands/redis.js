const redis = require('redis');
const redisPath = process.env("REDIS_PATH")

module.exports = async () => {
    return await new Promise((resolve, reject) => {
        const client = redis.createClient({
            url: redisPath
        })

        client.on('error', (err) => {
            console.error('Redis Error:', err)
            client.quit()
            reject(err)
        })

        client.on('ready', () => {
            resolve(client)
        })
    })
}

module.exports.expire = (callback) => {
    const expired = () => {
      const sub = redis.createClient({ url: redisPath })
      sub.subscribe('__keyevent@0__:expired', () => {
        sub.on('message', (channel, message) => {
          callback(message)
        })
      })
    }
  
    const pub = redis.createClient({ url: redisPath })
    pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], expired())
  }

module.exports.help = {
    name: "",
    aliases: []
}
