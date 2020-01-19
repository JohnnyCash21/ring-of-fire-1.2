const Discord = require("discord.js");
const Client = new Discord.Client();
const prefix = "!";
const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 1 };
var version = '1.2';
var servers = {};






Client.on('ready', ()=>{
    console.log("Bot is online.");
})

Client.on('guildMemberAdd', member =>{

    const channel = member.guild.channels.find(channel => channel.name === "general");
    if(!channel) return;

    channel.send(`Welcome to the CHEESE server, ${member}, please read the rules in the rules channel!`)

});

Client.on('message', (message)=>{
    if(!message.content.startsWith(prefix)) return;


    

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    switch (args[0]) {
        case 'play':
    
            function play(connection, message){
                var server = servers[message.guild.id];
    
                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: 'audio'}));
    
                server.queue.shift();
    
                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                });
            }
    
            if(!args[1]){
                message.channel.send("you need to provide a link");
                return;
            }
    
            if(!message.member.voiceChannel){
                message.channel.send("You must be in a voice channel to play the bot!");
                return;
            }
    
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }
    
            var server = servers[message.guild.id];
    
            server.queue.push(args[1]);
    
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            })
    
        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping the song...")
        break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection){
                for(var i = server.queue.length -1; i >=0; i--){
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                message.channel.send("Ending the queue, leaving the voice channel")
                console.log('stopped the queue')
            }

            if(message.guild.connection) message.guild.voiceConnection.disconnect();
            break;

             
    }



const photonum = [
        "./1.PNG/",
        "./2.PNG/",
        "./3.PNG/",
        "./4.PNG/",
        "./5.PNG/",
        "./6.PNG/",
        "./7.PNG/",
        "./8.PNG/",
        "./9.PNG/",
        "./10.PNG/",
        "./11.PNG/",
        "./12.PNG/",
        "./13.PNG/",
        "./14.PNG/",
        "./15.PNG/",
        "./16.PNG/",
        "./17.PNG/",
        "./18.PNG/",
        "./19.PNG/",
        "./20.PNG/",
        "./21.PNG/",
        "./22.PNG/",
        "./23.PNG/",
        "./24.PNG/",
        "./25.PNG/",
        "./26.PNG/",
        "./27.PNG/",
        "./28.PNG/",
        "./29.PNG/",
        "./30.PNG/",
        "./31.PNG/",
        "./32.PNG/",
        "./33.PNG/",
        "./34.PNG/",
        "./35.PNG/",
        "./36.PNG/",
        "./37.PNG/",
        "./38.PNG/",
        "./39.PNG/",
        "./40.PNG/",
        "./41.PNG/",
        "./42.PNG/",
        "./43.PNG/"


    ];

    if(message.content.startsWith(prefix + "image")){
        photonumber = 43;

        const randomPhoto = Math.floor(Math.random() * (photonumber - 1 + 1)) + 1;
    message.channel.send( {files: ["photonum"]} [randomPhoto]);
    }


    const response  = [
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes - definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful."
    ];

    if(message.content.startsWith(prefix + "8ball")){
        ballMessage = message.content.slice (7);
        responsenumber = 20;

        const randomIndex = Math.floor(Math.random() * (responsenumber - 1 + 1)) + 1;
    message.channel.send(response[randomIndex]);
        
    }

    
    
   
    const command = args.shift().toLowerCase();




    if (command === "ping") {
        message.channel.send(`Ring Of Fire! my Ping is ` + Math.round(Client.ping) + `ms`);
      }

    if(message.content.startsWith(prefix + "hello")){
        message.channel.send("Hello, i am Johhny Cash. How are you doing, " + message.author + " ?");

    }

    if(message.content.startsWith(prefix + "help")){
        message.channel.send("Check your Private Messages");
        message.author.send("Hello, **!hello** - you will be able to speak to me! \n **!help** - the reason you came here \n **!ping** - Shows how fast i respond back \n **!play (link)** - Make sure you are in Voice Channel, and insert YouTube link, and here the lovely music!; \n **!skip** - Skip the playing song \n **!stop** - Johnny Cash will leave the Voice Channel \n \n **!image** - Johnny Cash will send you one of Tom's cursed photoshops \n **!8ball** - ask a yes or no question, and let your fate decide...");

        
    }


    

})

    




Client.login(process.env.BOT_TOKEN);
