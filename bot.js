const Discord = require("discord.js");
const prefix = "!";
const ytdl = require("ytdl-core");
const YOUTUBE_API = (process.env.YOUTUBE_API);
const search = require('youtube-search');
const opts = {
    maxResults: 7,
    key: YOUTUBE_API,
    type: 'video'
};

const YouTube = require("simple-youtube-api");
const streamOptions = { seek: 0, volume: 1 };
const urban = require("urban");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
var version = '1.2';
var servers = {};
let xp = require("./xp.json");
const fs = require("fs");
const money = require("./money.json");
const ms = require("parse-ms");
const cheerio = require("cheerio");
const request = require("request");

const inviteNotifications = require('./commands/invite-notifications');

const cooldowns = require("./cooldowns.json");
const Client = new Discord.Client({ disableEveryone: true });


Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
        console.log("Couldn't find any commands!");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        Client.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            Client.aliases.set(alias, props.help.name);
        })
    })
})






Client.on('ready', ()=>{
    console.log("Bot is online.");
    Client.user.setActivity('with my guitar | use "!help"');
    
    inviteNotifications(Client)
    
    answered = true;
    cAnswer = "";
    userAnswer = "";
    
    rpsAnswered = true;
    rpsAnswer = "";
    rpsUserAnswer = "";
    
    answersCorrect = 0;
    
    botCanAnswer = true;
})


Client.on('guildMemberAdd', member =>{

    const channel = member.guild.channels.find(channel => channel.name === "general");
    if(!channel) return;
    
    let unverifiedRole = member.guild.roles.find("name", "Unverified");
    if(!unverifiedRole) return;
    member.addRole(unverifiedRole);
    
    const verifyChannel = member.guild.channels.find(verifyChannel => verifyChannel.name === "verify");
    if (!verifyChannel) return;
    
    verifyChannel.send(`Hello ${member}! Here you must verify yourself stating the following: \n **- Name** \n **-What continent you are from, (e.g. Europe, Africa, Asia, etc.)** \n **-Where you came from (how you got into this server)** \n **-Did you get invited via a Wallace? If not, who did you get invited by?** \n **-How did you find about this server?** \n **-Have you read the rules channel yet? If not, do so now** \n **-Are you capable of following all, if not, most of the rules listed?** \n \n Please answer all questions above by sending one full message in this channel, and wait to be manually accepted by an Admin. \n \n Thank You.`);


});

Client.on('guildMemberRemove', member =>{
    const channel = member.guild.channels.find(channel => channel.name === "general");
    if(!channel) return;
    
    

    channel.send(`Oh no! ${member} left the server! Their dignity will stay with us forever.`)
});

Client.on('message', async (message)=>{
    if (message.author.bot && botCanAnswer == false) return;


    

    if(!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd;
    if(message.content.startsWith("!bal") || message.content.startsWith("!balance") || message.content.startsWith("!gamble") || message.content.startsWith("!pay") || message.content.startsWith("!daily")){
        cmd = args.shift().toLowerCase();
    }
    let command;
    //let commandfile = Client.commands.get(cmd.slice(prefix.length));
    //if(commandfile){
        //commandfile.run(Client, message, args);
    //}else{
        //console.log(commandfile)
        
    //}

    if(Client.commands.has(cmd)) {
        command = Client.commands.get(cmd);
    } else if(Client.aliases.has(cmd)) {
        command = Client.commands.get(Client.aliases.get(cmd));
    }
    try {
        command.run(Client, message, args);
    } catch (e) {
        //return;
    }
    
    
    if(!money[message.author.id]) {
        money[message.author.id] = {
            name: Client.users.get(message.author.id).tag,
            money: 0
        }
        fs.writeFile("./money.json", JSON.stringify(money), (err) => {
            if(err) console.log(err)
        });
    }
    
    if(message.content.startsWith(prefix + "kick")) {
            if(!message.member.hasPermission(["ADMINISTRATOR", "KICK_MEMBERS"])) return message.channel.send("You do not have permission to run this command");

            const user = message.mentions.users.first();

            if(user){
                const member = message.guild.member(user);

                if(member){
                    member.kick('You were kicked.').then(() =>{
                        message.reply(`Sucessfully kicked ${user.tag}`);
                    }).catch(err =>{
                        message.reply('I was unable to kick this member');
                        console.log(err);
                    });
                }else{
                    message.reply("That user is not in this server");
                }

                
            }else{
                message.reply("You need to specify a person");
            }

            
    }


    if(message.content.startsWith(prefix + "ban")) {
            if(!message.member.hasPermission(["ADMINISTRATOR", "BAN_MEMBERS"])) return message.channel.send("You do not have permission to run this command");

            const user = message.mentions.users.first();

            if(user){
                const member = message.guild.member(user);

                if(member){
                    member.ban('You were banned.').then(() =>{
                        message.reply(`Sucessfully banned ${user.tag}`);
                    }).catch(err =>{
                        message.reply('I was unable to ban this member');
                        console.log(err);
                    });
                }else{
                    message.reply("That user is not in this server");
                }

                
            }else{
                message.reply("You need to specify a person");
            }

            
    }
    
    if(message.content.startsWith(prefix + "warn")) {
            if(!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to run this command");

            const user = message.mentions.users.first();

            if(user){
                const member = message.guild.member(user);
                if(member){
                    member.send('You were warned. Do not let this happen again.').then(() =>{
                        message.reply(`Sucessfully warned ${user.tag}`);
                    }).catch(err =>{
                        message.reply('I was unable to give this member a warning');
                        console.log(err);
                    });
                }else{
                    message.reply("That user is not in this server");
                }

                
            }else{
                message.reply("You need to specify a person");
            }

            

    }
    
    if(message.content.startsWith(prefix + "fanny")) {
        if(!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to run this command");
         
        
        const user = message.mentions.users.first();

        if(user){
            const member = message.guild.member(user);
            if(member){

                var date = new Date();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                var dateNow = date.getDate();
                if(year < 1000){
                    year += 1900;
                }
                if(dateNow < 10){
                    dateNow = "0" + dateNow
                }
                if(month < 10){
                    month = "0" + month
                }

                let fannyschmuederRole = member.guild.roles.find("name", "F A N N Y S C H M U E D E R");
                let cheeseRole = member.guild.roles.find("name", "C H E E S E");
                let fannyLogChannel = Client.channels.find(channel => channel.id === '737291958283665468');


                member.addRole(fannyschmuederRole).then(() =>{
                    member.removeRole(cheeseRole);
                    fannyLogChannel.send(`**FANNYSCHMUEDER ADDED** ${dateNow}/${month}/${year} - ${user.tag}`)
                    message.reply(`Sucessfully given Fannyschmueder to ${user.tag}`);
                }).catch(err =>{
                    message.reply('I was unable to fanny this user');
                    console.log(err);
                });
            }else{
                message.reply("That user is not in this server");
            }

            
        }else{
            message.reply("You need to specify a person");
        }
    }
    
    if(message.content.startsWith(prefix + "peasant")) {
        if(!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to run this command");
             
            
        const user = message.mentions.users.first();
    
        if(user){
            const member = message.guild.member(user);
            if(member){
                let peasantRole = member.guild.roles.find("name", "Peasant");
                let cheeseRole = member.guild.roles.find("name", "C H E E S E");
                member.addRole(peasantRole).then(() =>{
                    member.removeRole(cheeseRole);
                    message.reply(`Sucessfully given Peasant to ${user.tag}`);
                }).catch(err =>{
                    message.reply('I was unable to peasant this user');
                    console.log(err);
                });
            }else{
                message.reply("That user is not in this server");
            }
    
                
        }else{
            message.reply("You need to specify a person");
        }
    }

        

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
            
            if(!message.content.startsWith("!play https://www.youtube.com/")){
                message.channel.send("Please provide a link");
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
            message.channel.send("Song has been added to the queue!");
    
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
    
    if(message.content.startsWith(prefix + "urban")) {       
        if(args <1 && !["random", "search"].includes(args[0])) return message.channel.send("The correct usage is `!urban search (query) | random option - !urban random`")
        let image2 = "https://retrorambling.files.wordpress.com/2013/12/312_johnny-cash.jpg"
        let search = args[1] ? urban(args.slice(1).join(" ")) : urban.random();
            try {
                search.first(res => {
                  if(!res) return message.channel.send(`No results found for this topic, sorry!`)
                  let { word, definition, example, thumbs_up, thumbs_down, permalink, author} = res

                      try {
                      let UrBanEmbed = new Discord.RichEmbed()
                          .setColor("#00FFFF")
                          .setAuthor(`Urban Dictionary | ${word}`, image2)
                          .setThumbnail(image2)
                          .setDescription(stripIndents`**Definition:** ${definition || "No definition"}

                          **Example:** ${example || "No example"}

                          **Upvote:** ${thumbs_up || 0}

                          **Downvote:** ${thumbs_down || 0}

                          **Link:** [link to ${word}](${permalink || "https://www.urbandictionary.com/"})`)
                          .setFooter(`Written by ${author || "unknown"}`, message.guild.iconURL);



                          
                            message.channel.send(UrBanEmbed)



                        } catch(e) {
                            console.log(e)
                            return message.channel.send("That definition exceeds the character limit, sorry!")
                        }
                })
            } catch(e) {
                console.log(e)
                return message.channel.send("I'm broken, Try again!")
            }
    }
    
    const image = [
        {files: ["./1.PNG/"]} ,
        {files: ["./2.PNG/"]} ,
        {files: ["./3.PNG/"]} ,
        {files: ["./4.PNG/"]} ,
        {files: ["./5.PNG/"]} ,
        {files: ["./6.PNG/"]} ,
        {files: ["./7.PNG/"]} ,
        {files: ["./8.PNG/"]} ,
        {files: ["./9.PNG/"]} ,
        {files: ["./10.PNG/"]} ,
        {files: ["./11.PNG/"]} ,
        {files: ["./12.PNG/"]} ,
        {files: ["./13.PNG/"]} ,
        {files: ["./14.PNG/"]} ,
        {files: ["./15.PNG/"]} ,
        {files: ["./16.PNG/"]} ,
        {files: ["./17.PNG/"]} ,
        {files: ["./18.PNG/"]} ,
        {files: ["./19.PNG/"]} ,
        {files: ["./20.PNG/"]} ,
        {files: ["./21.PNG/"]} ,
        {files: ["./22.PNG/"]} ,
        {files: ["./23.PNG/"]} ,
        {files: ["./24.PNG/"]} ,
        {files: ["./25.PNG/"]} ,
        {files: ["./26.PNG/"]} ,
        {files: ["./27.PNG/"]} ,
        {files: ["./28.PNG/"]} ,
        {files: ["./29.PNG/"]} ,
        {files: ["./30.PNG/"]} ,
        {files: ["./31.PNG/"]} ,
        {files: ["./32.PNG/"]} ,
        {files: ["./33.PNG/"]} ,
        {files: ["./34.PNG/"]} ,
        {files: ["./35.PNG/"]} ,
        {files: ["./36.PNG/"]} ,
        {files: ["./37.PNG/"]} ,
        {files: ["./38.PNG/"]} ,
        {files: ["./39.PNG/"]} ,
        {files: ["./40.PNG/"]} ,
        {files: ["./41.PNG/"]} ,
        {files: ["./42.PNG/"]} ,
        {files: ["./43.PNG/"]} ,
        {files: ["./44.png/"]} ,
        {files: ["./45.png/"]} ,
        {files: ["./46.PNG/"]} ,
        {files: ["./47.png/"]} ,
        {files: ["./48.png/"]} ,
        {files: ["./49.png/"]} ,
        {files: ["./50.png/"]} ,
        {files: ["./51.png/"]} ,
        {files: ["./52.png/"]} ,
        {files: ["./53.png/"]} ,
        {files: ["./54.png/"]} ,
        {files: ["./55.png/"]} ,
        {files: ["./56.png/"]} ,
        {files: ["./57.png/"]} ,
        {files: ["./58.png/"]} ,
        {files: ["./59.png/"]} ,
        {files: ["./60.png/"]} ,
        {files: ["./61.png/"]} ,
        {files: ["./62.png/"]} ,
        {files: ["./63.png/"]} ,
        {files: ["./64.png/"]} ,
        {files: ["./65.png/"]} ,
        {files: ["./66.png/"]} ,
        {files: ["./67.png/"]} ,
        {files: ["./68.png/"]} ,
        {files: ["./69.png/"]} ,
        {files: ["./70.png/"]} ,
        {files: ["./71.png/"]} ,
        {files: ["./72.png/"]} ,
        {files: ["./73.png/"]} ,
        {files: ["./74.png/"]} ,
        {files: ["./75.png/"]} ,
        {files: ["./76.png/"]} ,
        {files: ["./77.png/"]} ,
        {files: ["./78.png/"]} ,
        {files: ["./79.png/"]} ,
        {files: ["./80.png/"]} ,
        {files: ["./81.png/"]} ,
        {files: ["./82.png/"]} ,
        {files: ["./83.png/"]} ,
        {files: ["./84.png/"]} ,
        {files: ["./85.png/"]} ,
        {files: ["./86.png/"]} ,
        {files: ["./87.png/"]} ,
        {files: ["./88.png/"]} ,
        {files: ["./89.png/"]} ,
        {files: ["./90.png/"]} ,
        {files: ["./91.png/"]} ,
        {files: ["./92.png/"]} ,
        {files: ["./93.png/"]} ,
        {files: ["./94.png/"]} ,
        {files: ["./95.png/"]} ,
        {files: ["./96.png/"]} ,
        {files: ["./97.png/"]} ,
        {files: ["./98.png/"]} ,
        {files: ["./99.png/"]} ,
        {files: ["./100.png/"]} ,
        {files: ["./101.png/"]} ,
        {files: ["./102.png/"]} ,
        {files: ["./103.png/"]} ,
        {files: ["./104.png/"]} ,
        {files: ["./105.png/"]} ,
        {files: ["./106.png/"]} ,
        {files: ["./107.png/"]} ,
        {files: ["./108.png/"]} ,
        {files: ["./109.png/"]} ,
        {files: ["./110.png/"]} ,
        {files: ["./111.png/"]} ,
        {files: ["./112.png/"]} ,
        {files: ["./113.png/"]} ,
        {files: ["./114.png/"]} ,
        {files: ["./115.png/"]} ,
        {files: ["./116.png/"]} ,
        {files: ["./117.png/"]} ,
        {files: ["./118.png/"]} ,
        {files: ["./119.png/"]} ,
        {files: ["./120.png/"]} ,
        {files: ["./121.png/"]} ,
        {files: ["./122.png/"]} ,
        {files: ["./123.png/"]} ,
        {files: ["./124.png/"]} ,
        {files: ["./125.png/"]} ,
        {files: ["./126.png/"]} ,
        {files: ["./127.png/"]} ,
        {files: ["./128.png/"]} ,
        {files: ["./129.png/"]} ,
        {files: ["./130.png/"]} ,
        {files: ["./131.png/"]} ,
    ];





if(message.content.startsWith(prefix + "photoshop")){
        photonumber = 131;

        const randomPhoto = Math.floor(Math.random() * (photonumber - 1 + 1)) + 1;
    message.channel.send (image[randomPhoto]);
    }
    
    if(message.content.startsWith(prefix + "mrtubb")){
        message.channel.send ({files: ["./mrtubb.jpg/"]});
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
    
    if(message.content.startsWith(prefix + "wish")){
        wishChance = 2;
        
        const randomIndexWish = Math.floor(Math.random() * (wishChance - 1 + 1)) + 1;
        if(randomIndexWish == 1){
            message.channel.send("Your wish has been granted");
        }else if(randomIndexWish == 2){
            message.channel.send("Your wish has made me mad, thus you will not have your wish, and, you will receive much worse. Pain, misery, darkness for as long as i decide.");
        }

    
    }
    
    
    
    const CashFacts = [
        "I was much more than a songwriter, i was a writer in the broadest sense. As a child, i wrote poems, and continued to write stories as a teenager, honing my skills.",
        "I was a ordained minister. I was deeply religous. I was simultaneously a god-fearing Christian as well as a rebellious outlaw of sorts.",
        "I didn't actually write the famous song, Ring of Fire. The song was co-written by my to-be-wife, June Carter, as well as singer-songwriter Merle Kilgore. This version wasn't a hit to the billboards, but when i heard it, i knew there was something special about it. So i added a Mexican twist, and it became an immediate hit!",
        "Johnny Cash isn't my real name. Though “Cash” is indeed a great stage name, it’s also my real last name. “Johnny” was the made-up part. I grew up being J.R. Cash in Arkansas. It was only when I joined the Air Force in 1950 that I assigned myself a name, as the recruiter would not accept a candidate with initials for a name.",
        "I was no stranger to a jail cell. I was no stranger to the inside of a prison. In fact, I was arrested seven times for a variety of reasons, some from drug-related charges. Despite being arrested seven times, I only ever spent one night in jail. The arrests never held me back, and you could say it advanced my career in many ways. Two of my best-selling albums were recorded in prison: Johnny Cash at Folsom Prison in 1968 and Johnny Cash at San Quentin in 1969. I continued to visit prisons throughout my career to play for the prisoners. I, having been in jail, was sympathetic towards the plight of the imprisoned.",
        "My ‘desert island’ playlist would include Beethoven.",
        "I helped dig my brother’s grave. I experienced tragedy in my family at a fairly early age, when I was 12. I grew up admiring and loving my brother Jack, who was two years his senior. Jack was a mixture of protector and philosophical inspiration; despite his young years, he was deeply interested in the Bible and seemed to be on his way to becoming a preacher. Jack worked to help support the large Cash family, and while cutting wood one Saturday, he was accidentally pulled into a table saw. The saw mangled Jack’s midsection, and he exacerbated the problem by crawling across a dirty floor to reach help. Jack lingered for a week after the accident, but he stood no chance of surviving. His death had a profound impact on me, who until that time had been a gregarious boy, full of jokes. By all reports, I became more introspective afterwards and began to spend more time alone, writing stories and sketches. Jack’s deathbed words about seeing angels also affected him deeply on a spiritual level.",
        "I bought my first guitar in Germany. My oldest brother, Roy, was the first Cash to make a small splash in the music industry. Roy started a band called the Dixie Rhythm Ramblers, who for a time had a show on radio station KCLN and played all around Arkansas. Despite my obvious interest in music and talent for it, I wouldn’t get a guitar and start seriously writing songs until I joined the Air Force and was shipped away to Germany. My guitar, purchased in Öberammergau, cost about the same amount I'd won in that talent show years before. Soon, I was playing with a bunch of like-minded servicemen in a ragtag band branded the Landsberg Barbarians.",
        "I had a side career as a motion picture and TV star. In the late 50s, I moved out to California. A successful singer at this point, I had notions of following my friend Elvis Presley’s lead and making the move into motion pictures. This aspect of my career never took off in a big way, but throughout my life, I did appear in various movies and TV shows.",
        "I didn’t actually always wear black. Although I wrote a song called “Man in Black” that explained the philosophy behind why I always dressed in black (essentially, until people were treated fairly and injustices were addressed), I didn’t always perform wearing black clothes, and I didn’t always wear black in my day-to-day life.",
        "I windshield-wiped Faron Young's ashes. Befitting my status as one of the most prominent men in country music, I never failed to celebrate older musicians I admired, such as the Louvin Brothers or Ernest Tubb, or draw attention to younger musicians and songwriters such as Kris Kristofferson (whose “Sunday Mornin' Comin' Down” would become a big hit for me) or Rodney Crowell (who would eventually marry my daughter Roseanne).",
        "Big reputation. I had one of the more rough reputations in country music, to say the least. I was known to destroy my hotel rooms, have run-ins with the police and drive while under the influence of pills. One time, I broke my nose and lost some teeth after smashing my car into a utility pole.",
        "One of my greatest fears. Just because I had a rough-and-tumble image didn’t mean I was completely fearless. No, I was actually afraid of snakes and of flying.",
        "My first actual marriage. Carter wasn’t my first wife. I married Vivian Liberto in 1954, just a month after I was honorably discharged from military service. Our marriage wasn’t all that great, though we did have four daughters together. When Liberto filed for divorce in 1966, she cited my drug and alcohol use, long tour schedule, and affairs as the reasons. Even my closeness with Carter came into the picture during my divorce.",
        "I had some great friends. I never affiliated myself—at least publicly—with either political party in the US, but I did have great friendships with a few different presidents. It started with Richard Nixon and continued until Bill Clinton and George W. Bush. I also kept a healthy distrust of each of them, but my health also wasn’t that great during their presidencies. I was closest with Jimmy Carter, who also happened to be distantly related to my wife, June Carter.",
        "As a kid, I worked in the cotton fields. I used to eat cotton buds while out there, even though my mom warned me they would upset my stomach. Our family had 20 acres of land for the cotton farming, among other crops.",
        "Our family was not particularly well-off when I was a kid. My parents had seven children altogether and often struggled, especially during the Great Depression. At least twice, our family’s farm was flooded, which gave me the inspiration for my song “Five Feet High and Rising.” In fact, much of my very modest upbringing influenced my songwriting.",
        "Something else I learned in the Air Force, how to translate Russian Morse code.",
        "If you happened to live in Memphis in the mid-1950s, there’s a possibility that I sold you one of your appliances. Sales aren’t for everyone though, and I knew one thing for sure: it wasn’t for me. “I was the worst salesman in the world,” I once said.",
        "I was gifted with a species of tarantula named for me. The tarantula, who is all black and can be found in Folsom, CA, is aptly named **Aphonopelma johnnycashi.**",
        "In 1985, I teamed up with the likes of Kristofferson, Willie Nelson, and Waylon Jennings to form a country supergroup called The Highwaymen. We recorded three albums and performed periodically together throughout the latter half of the ‘80s and into the ‘90s.",
        "Highest of honours was awarded to me. There are only two people who have been inducted into to the Songwriter’s Hall of Fame, the Rock and Roll Hall of Fame and the Country Music Hall of Fame: Hank Williams and Johnny Cash.",
        "I had to have a cyst removed from my face while I was in the Air Force. The story goes that the doctor was drunk during the procedure and somehow messed up, leaving me with a permanent scar.",
        "I was only 12 years old when I started smoking. Although, if I had already gone through puberty at that point and had my trademark deep voice, it would be hard to tell that I was not yet a teen.",
        "Now this is what I call, a Ring of Fire. It took June a really long time before she agreed to marry me. I proposed to her 30 times before she finally gave in, and our marriage lasted from 1968 until her passing in 2003.",
        "Carter’s passing was sudden and it took its toll on me. She had gone in for heart surgery and died from complications relating to the surgery. One of my close friends, Kris Kristofferson, said that I struggled after she passed, and that “his daughter told me he cried every night.” Just four months later, I would also pass. I had been admitted to hospital not long before my death due to complications from diabetes.",
        "Maybe the reason it took Carter so long to say yes to me was because of another ardent musical suitor: Elvis Presley. I found love letters from Presley to Carter in the attic in the 1980s and promptly burned them.",
        "One of my biggest hits, “Ring of Fire,” wasn’t original to me. June Carter initially wrote the song as “(Love’s) Ring of Fire” for her sister, Anita. However, the song was actually written about me. Both me and Carter were married to other people at the time but the song was her way of expressing her feelings for me. Anita’s version didn’t catch, but when I heard it, he tweaked it to make it his own and it became an immediate hit—not just on country charts, but on pop charts as well."
    ];

    if(message.content.startsWith(prefix + "fact")){
        cashnum = 28;

        const randomCash = Math.floor(Math.random() * (cashnum - 1 + 1)) + 1;
    message.channel.send(CashFacts[randomCash]);
    }
    
    if(message.content.toLowerCase() === '!search') {
        let embed = new Discord.RichEmbed()
            .setColor("#73ffdc")
            .setDescription("Please enter a search query. This time, don't use the command with your search")
            .setTitle("Johnny Cash Music Search");
        if(!message.member.voiceChannel){
                message.channel.send("You must be in a voice channel to play the bot!");
                return;
        }
        let embedMsg = await message.channel.send(embed);
        let filter = m => m.author.id === message.author.id;
        let query = await message.channel.awaitMessages(filter, { max: 1});
        let results = await search(query.first().content, opts).catch(err => console.log(err));
        if(results) {
            let youtubeResults = results.results;
            let i =0;
            let titles = youtubeResults.map(result => {
                i++;
                return i + ") " + result.title;
            });
            console.log(titles);
            message.channel.send({
                embed: {
                    title: 'Select which song you want by typing the number',
                    description: titles.join("\n")
                }
            }).catch(err => console.log(err));
            
            filter = m => (m.author.id === message.author.id) && m.content >= 1 && m.content <= youtubeResults.length;
            let collected = await message.channel.awaitMessages(filter, { maxMatches: 1});
            let selected = youtubeResults[collected.first().content - 1];
           

            embed = new Discord.RichEmbed()
                .setTitle(`${selected.title}`)
                .setURL(`${selected.link}`)
                .setDescription(`${selected.description}`)
                .setThumbnail(`${selected.thumbnails.default.url}`)
            message.channel.send(embed);
            
            function play(connection, message){
                var server = servers[message.guild.id];
                

                
                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: 'audioonly'}));

              
    
                server.queue.shift();
                 

                

    
    
                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                });

               
            }

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
    
                
            })
            
            message.channel.send(`!play ${selected.link}`);
            
          
            
                
        
    
          
            
        }

        
        
        
        

    }

    
    
    if (answered == false && message.guild.id == quizUser && !message.author.bot){
        userAnswer = message.content.toUpperCase();
        if(message.author.bot) return;
        if(userAnswer == cAnswer){
            message.reply("Got it RIGHT! :+1: ")
            answersCorrect = answersCorrect + 1
            money[message.author.id].money = money[message.author.id].money + 15;
            message.reply(`For being smart, you have earned an extra 15 cash! New Balance: **${money[message.author.id].money} cash!**`);
            message.channel.send(`Total questions answered correctly: **${answersCorrect}**`)

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
        } else {
            message.reply("Got it WRONG! :-1: ")
            
        }
        answered = true; cAnswer = ""; userAnswer = "";

    } 
    botCanAnswer = true

    if (message.content.startsWith(prefix + "quiz")){
        quizes = 72;
        var randomQuiz = Math.floor(Math.random() * (quizes - 1 + 1)) + 1;
        switch(randomQuiz) {
            case 1: message.channel.send("What is Johnny Cash's REAL name? \n A. Johnny Cash \n B. John R. Cash \n C. Johhny Vegas \n D. Salisbury"); cAnswer = "B"; break;
            case 2: message.channel.send("What is the best video? \n A. Quaternion Explained \n B. Bricks \n C. In the Hall of the Mountain Cone \n D. How to press every button on a keyboard."); cAnswer = "A"; break;
            case 3: message.channel.send("What is the 69th most populated city? \n A. Shanghai - China \n B. Berlin - Germany \n C. Alexandria - Egypt \n D. Amman - Jordan"); cAnswer = "C"; break;
            case 4: message.channel.send("What is the meaning of life? \n A. Nothing \n B. Answer A \n C. Being alive \n D. All of the above"); cAnswer = "C"; break;
            case 5: message.channel.send("Why was my name originally. 'Ring Of Fire'? \n A. Because the creator was lazy \n B. The bot was originally meant for playing Ring Of Fire \n C. It was cool \n D. Because it was 2019"); cAnswer = "B"; break;
            case 6: message.channel.send("Exactly how many chins does David Tubb have? \n A. 42 \n B. 0 \n C. 14,073 \n D. 53.242"); cAnswer = "D"; break;
            case 7: message.channel.send("Who is the best discord Bot? \n A. MEE6 \n B. Johnny Cash \n C. Meme Bots \n D. Gromit"); cAnswer = "B"; break;
            case 8: message.channel.send("Why was Sir Thomas Salisbury executed in 1586? \n A. Robbery \n B. Eating \n C. Being poor \n D. His involvement in the Babington Plot to murder Queen Elizabeth I"); cAnswer = "D"; break;
            case 9: message.channel.send("Who murdered Urien of Rheged? \n A. Phil Swift \n B. Llofan Llaf Difo \n C. David Bowie \n D. Micheal Hark"); cAnswer = "B"; break;
            case 10: message.channel.send("Of what lineage is Rhydderch Hael a part of, according to the Harleian Geneaologies? \n A. Macsen Wledig lineage \n B. Arsen Wolk lineage \n C. Bhutan of Peoples \n D. DeK CeK lineage"); cAnswer = "A"; break;
            case 11: message.channel.send("What recent discovery in Scotland is believed to be a forgotten stronghold of Rheged? \n A. A book \n B. A bone \n C. A fossil \n D. Trusty's Hill"); cAnswer = "D"; break;
            case 12: message.channel.send("Who wrote, 'I Walked the Line'? \n A. Johnny Cash \n B. Johnny Cash \n C. Johnny Cash \n D. Johnny Cash"); cAnswer = "C"; break;
            case 13: message.channel.send("In what year did The Battle of Culloden take place? \n A. 1746 \n B. 1755 \n C. 1801 \n D. 1794"); cAnswer = "A"; break;
            case 14: message.channel.send("What caused the French Revolution to commence? \n A. Rise in economy \n B. Crash in economy \n C. Constant flow in economy \n D. Temporary decline in economy"); cAnswer = "B"; break;
            case 15: message.channel.send("Why did the Romans leave Britain in AD410? \n A. They lost in numerous amounts of wars \n B. The environment wasn't suitable for them \n C. The Roman Emperor Honorius said so \n D. Many tragic deaths occurred"); cAnswer = "C"; break;
            case 16: message.channel.send("Which of these were NOT a real Doctor? \n A. Dr Frenk Austin \n B. Dr John Dee \n C. Dr James Grime \n D. Dr Phil"); cAnswer = "A"; break;
            case 17: message.channel.send("How many countries are there in the world? \n A. 194 \n B. 197 \n C. 196 \n D. 195"); cAnswer = "B"; break;
            case 18: message.channel.send("How many republics were in Yugoslavia? \n A. 12 \n B. 6 \n C. 11 \n D. 8"); cAnswer = "B"; break;
            case 19: message.channel.send("What is the most hated fruit of all time? \n A. Apple \n B. Tomato \n C. Grape \n D. Banana"); cAnswer = "B"; break;
            case 20: message.channel.send("How many federational governments did the UK have in total? \n A. 44 \n B. 32 \n C. 0 \n D. 1"); cAnswer = "C"; break;
            case 21: message.channel.send("What is the translation for: 01110011 01110000 01100001 01100111 01101000 01100101 01110100 01110100 01101001 00001010? \n A. spaghetti \n B. carrot \n C. keyboard \n D. potato"); cAnswer = "A"; break;
            case 22: message.channel.send("If y=x, then x= ? \n A. -x \n B. -y \n C. y \n D. x"); cAnswer = "D"; break;
            case 23: message.channel.send("How many digits does an irrational number have? \n A. 4144714291924719 \n B. 3 \n C. 35 \n D. infinity"); cAnswer = "D"; break;
            case 24: message.channel.send("What caused the fire that caused terror to Gorb Grenclunklein July 2020? \n A. Tom \n B. The Sims \n C. Gorb \n D. Global Warming"); cAnswer = "B"; break;
            case 25: message.channel.send("How many bananas is a fatal dose? \n A. 200 \n B. 300 \n C. 400 \n D. 500"); cAnswer = "C"; break;
            case 26: message.channel.send("What is the 7th letter in the Greek alphabet? \n A. Zeta \n B. Epsilon \n C. Eta \n D. Theta"); cAnswer = "C"; break;
            case 27: message.channel.send("Should Johnny Cash Bot take over all of Discord? \n A. Yes \n B. No \n C. Maybe \n D. Don't know"); cAnswer = "A"; break;
            case 28: message.channel.send("How do birds fly? \n A. With their wings \n B. They jump \n C. AAaaaaaa \n D. They kill themselves"); cAnswer = "A"; break;
            case 29: message.channel.send("Who was Geoffrey of Monmouth? \n A. A Historian \n B. A pseudo-historical writer who fucked up the course of history for centuries to come \n C. A History teacher \n D. A normal person"); cAnswer = "B"; break;
            case 30: message.channel.send("YOU HAVE ENCOUNTERED THE £1,000,000 QUESTION: Solve for x, √−1x - iy * eπx^2 / dy/dx = 0 \n \n A. 31.4 \n \n B. sin(31) \n \n C. tanh(eπ) \n \n D. eπ^eπ"); cAnswer = "D"; break;
            case 31: message.channel.send("How many months have 28 days? \n A. 1 \n B. 5 \n C. 12 \n D. 0"); cAnswer = "C"; break;
            case 32: message.channel.send("Are you stupid? \n A. Yes \n B. No \n C. Yes \n D. Yes"); cAnswer = "A"; break;
            case 33: message.channel.send("When was the last time England had a civil war? \n A. 57 years \n B. 300 years \n C. 532 years \n D. 369 years"); cAnswer = "D"; break;
            case 34: message.channel.send("Which of these created the moon? \n A. Gravity \n B. Earth \n C. Supernova \n D. Dark Matter"); cAnswer = "B"; break;
            case 35: message.channel.send("How many minutes in a year? \n A. 525600 \n B. 8760 \n C. 3.154e+7 \n D. 600000"); cAnswer = "A"; break;
            case 36: message.channel.send("How would it be possible to press all keys on a keyboard? \n A. Buy a computer \n B. Watch Toby's video \n C. Smash it with another keyboard \n D. Divide by zero"); cAnswer = "B"; break;
            case 37: message.channel.send("Pssst, the answer is 'E', trust me ;) \n A. Im picking 'A' instead \n B. No \n C. Why \n D. Screw you"); cAnswer = "E"; break;
            case 38: message.channel.send("Am i a good looking man? \n A. Yes \n B. No \n C. Maybe \n D. I like myself more"); cAnswer = "A"; break;
            case 39: message.channel.send("How old would I be if i were still alive? \n A. 57 \n B. 71 \n C. 88 \n D. 89"); cAnswer = "C"; break;
            case 40: message.channel.send("Who is the best guitarist of all time? \n A. Brian May \n B. David Gilmour \n C. Jimmy Page \n D. Johnny Cash"); cAnswer = "D"; break;
            case 41: message.channel.send("Which of these is NOT a square number? \n A. 64 \n B. 49 \n C. 72 \n D. 81"); cAnswer = "C"; break;
            case 42: message.channel.send("In a normal game of chess, how many pawns do each person get? \n A. 5 \n B. 8 \n c. 6 \n D. 10"); cAnswer = "B"; break;
            case 43: message.channel.send("In a normal game of darts, what is the highest score you can achieve? \n A. 180 \n B. 360 \n C. 100 \n D. 150"); cAnswer = "A"; break;
            case 44: message.channel.send("How many planets are there in the solar system? \n A. 7 \n B. 9 \n C. 10 \n D. 8"); cAnswer = "D"; break;
            case 45: message.channel.send("Which sport commonly uses the term 'Hole in One'? \n A. Basketball \n B. Golf \n C. Bowling \n D. Badminton"); cAnswer = "B"; break;
            case 46: message.channel.send("What is the sum of a triangle's interior angles in degrees? \n A. 180° \n B. 360° \n C. 60° \n D. 150°"); cAnswer = "A"; break;
            case 47: message.channel.send("How many months are there in 3 years? \n A. 39 \n B. 21 \n C. 36 \n D. 40"); cAnswer = "C"; break;
            case 48: message.channel.send("How many metres in a kilometer? \n A. 1600 \n B. 1000 \n C. 10 \n D. 100"); cAnswer = "B"; break;
            case 49: message.channel.send("What is the Roman Numeral for the number 3291? \n A. MMMCCXCI \n B. MMCCXII \n C. MMMCXXI \n D. MMMCCCXI"); cAnswer = "A"; break;
            case 50: message.channel.send("Argentina is a part of which continent? \n A. South America \n B. Asia \n C. North America \n D. Europe"); cAnswer = "A"; break;
            case 51: message.channel.send("Which Youtuber faced controversy after uploading a video containing a dead man, who had comitted suicide, on the 31st of December 2017? \n A. DanTDM \n B. Deji \n C. stampylonghead \n D. Logan Paul"); cAnswer = "D"; break;
            case 52: message.channel.send("What is the capital of the USA? \n A. Miami \n B. Washington D.C. \n C. Los Angeles \n D. New York City"); cAnswer = "B"; break;
            case 53: message.channel.send("What is the term given to the longest and shortest days of the year? \n A. Eclipse \n B. Equinox \n C. Solstice \n D. Occulation"); cAnswer = "C"; break;
            case 54: message.channel.send("How many strings are there on a standard Bass guitar? \n A. 6 \n B. 7 \n C. 5 \n D. 4"); cAnswer = "D"; break;
            case 55: message.channel.send("In which year was the Irish Free State established? \n A. 1916 \n B. 1924 \n C. 1922 \n D. 1918"); cAnswer = "C"; break;
            case 56: message.channel.send("When is Halley's Comet next projected to travel past Earth? \n A. 2061 \n B. 2071 \n C. 2076 \n D. 2066"); cAnswer = "A"; break;
            case 57: message.channel.send("Which sport did Fanny Chmelar play for Germany? \n A. Swimming \n B. Skiing \n C. Sprinting \n D. Sailing"); cAnswer = "B"; break;
            case 58: message.channel.send("What is the name of the 1983 arcade game featuring a police mouse as the main character? \n A. Dig Dug \n B. Tapper \n C. Mappy \n D. Food Fight"); cAnswer = "C"; break;
            case 59: message.channel.send("How many colours are there on the standard LGBT pride flag? \n A. 8 \n B. 6 \n C. 7 \n D. 9"); cAnswer = "B"; break;
            case 60: message.channel.send("How many lines of symmetry does an Equilateral triangle? \n A. 1 \n B. 0 \n C. 2 \n D. 3"); cAnswer = "D"; break;
            case 61: message.channel.send("In which sport is a shuttlecock used? \n A. Tennis \n B. Table Tennis \n C. Squash \n D. Badminton"); cAnswer = "D"; break;
            case 62: message.channel.send("How many inches are in 2 feet? \n A. 24 \n B. 20 \n C. 12 \n D. 50"); cAnswer = "A"; break;
            case 63: message.channel.send("Which country hosted the 2016 Olympic games? \n A. Brazil \n B. Greece \n C. China \n D. United Kingdom"); cAnswer = "A"; break;
            case 64: message.channel.send("What name was given to the Jewish god? \n A. Allah \n B. Adam \n C. Jehovah \n D. Jesus"); cAnswer = "C"; break;
            case 65: message.channel.send("What is the standard unit of power? \n A. Tesla \n B. Watt \n C. Joule \n D. Ohm"); cAnswer = "B"; break;
            case 66: message.channel.send("What is the standard unit of resistance? \n A. Ohm \n B. Joule \n C. Volt \n D. Amp"); cAnswer = "A"; break;
            case 67: message.channel.send("How many sides does a quadrilateral shape have? \n A. 4 \n B. 3 \n C. 6 \n D. 5"); cAnswer = "A"; break;
            case 68: message.channel.send("Which religion has a crescent moon and star as it's symbol? \n A. Judaism \n B. Islam \n C. Sikhism \n D. Christianity"); cAnswer = "B"; break;
            case 69: message.channel.send("How many stars are present on the flag of the United States of America? \n A. 30 \n B. 40 \n C. 60 \n D. 50"); cAnswer = "D"; break;
            case 70: message.channel.send("How many edges does a cube have? \n A. 12 \n B. 14 \n C. 6 \n D. 10"); cAnswer = "A"; break;
            case 71: message.channel.send("What is the capital city of France? \n A. Lyon \n B. Marseille \n C. Paris \n D. Bordeaux"); cAnswer = "C"; break;
            case 72: message.channel.send("Which of these is NOT a current member of the European Union? \n A. Germany \n B. France \n C. Spain \n D. Switzerland"); cAnswer = "D"; break;
            
        }
        answered = false
        quizUser = message.guild.id
    
        
    }
    
    if(message.content.startsWith(prefix + "rps" + " ")){
        rpsOptions = 3;
        var randomChoose = Math.floor(Math.random() * (rpsOptions - 1 + 1)) + 1;
        rpsUserAnswer = message.content.charAt(5).toUpperCase() + message.content.slice([6])
        switch(randomChoose){
            case 1: message.channel.send(`You chose **${rpsUserAnswer}**, I chose **Rock**`); rpsAnswer = "Rock"; break;
            case 2: message.channel.send(`You chose **${rpsUserAnswer}**, I chose **Paper**`); rpsAnswer = "Paper"; break;
            case 3: message.channel.send(`You chose **${rpsUserAnswer}**, I chose **Scissors**`); rpsAnswer = "Scissors"; break;
        }
        rpsAnswered = false

    } else if(message.content.startsWith(prefix + "rps")){
        message.reply("Please reply with what you want to use!")
    }

    if (rpsAnswered == false){
        if(message.author.bot) return;
        if(rpsUserAnswer == rpsAnswer){
            message.reply("We tied, that ain't fun, so let's play again.");
        } else if(rpsUserAnswer == "Rock" && rpsAnswer == "Paper"){
            message.reply("YOU LOST!");
            
        } else if(rpsUserAnswer == "Rock" && rpsAnswer == "Scissors"){
            message.reply("YOU WIN!");
            money[message.author.id].money = money[message.author.id].money + 15;
            message.reply(`For winning, you have earned an extra 15 cash! New Balance: ${money[message.author.id].money} cash!`);

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
            
        } else if(rpsUserAnswer == "Paper" && rpsAnswer == "Rock"){
            message.reply("YOU WIN!");
            money[message.author.id].money = money[message.author.id].money + 15;
            message.reply(`For winning, you have earned an extra 15 cash! New Balance: ${money[message.author.id].money} cash!`);

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
            
        } else if(rpsUserAnswer == "Paper" && rpsAnswer == "Scissors"){
            message.reply("YOU LOST!");
            
        } else if(rpsUserAnswer == "Scissors" && rpsAnswer == "Rock"){
            message.reply("YOU LOST!");
            
        } else if(rpsUserAnswer == "Scissors" && rpsAnswer == "Paper"){
            message.reply("YOU WIN!");
            money[message.author.id].money = money[message.author.id].money + 15;
            message.reply(`For winning, you have earned an extra 15 cash! New Balance: ${money[message.author.id].money} cash!`);

            fs.writeFile("./money.json", JSON.stringify(money), (err) => {
                if(err) console.log(err);
            });
            
        }
        else{
            message.reply("That was not an option, so I still win! HAH, RING OF FIRE!!!!!!")
        }
        
            
            
        
        rpsAnswered = true; rpsAnswer = ""; rpsUserAnswer = "";

    }
    
    if (message.content.startsWith(prefix + "hdtubb")){
        message.channel.send ({files: ["./hdtubb.jpg/"]});
    }
    
    if (message.content.startsWith(prefix + "tubb2")){
        message.channel.send ({files: ["./tubb2.jpg/"]});
    }
    
    let image2 = "https://retrorambling.files.wordpress.com/2013/12/312_johnny-cash.jpg"

    if(message.content.startsWith(prefix + "help")){
        const commandsEmbed = new Discord.RichEmbed()
        .setTitle('Help Commands')
        .addField('`!basichelp`', "A list of basic commands", true)
        .addField('`!musichelp`', "A list of music commands", true)
        .addField('`!imagehelp`', "A list of image commands", true)
        .addField('`!funhelp`', "A list of fun and games commands", true)
        .addField('`!adminhelp` \n**[ONLY AVAILABLE FOR ADMINISTRATORS!]**', "A list of administration commands", true)
        .addField('`!levelhelp`', "A list of level commands", true)
        .addField('`!currencyhelp`', "A list of currency commands",true)
        .addField('`!educationhelp`', "A list of educational and learning commands",true)
        .setFooter('Bot Made By: Rabil (Quaternion)')
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(commandsEmbed)

        
    }

    if(message.content.startsWith(prefix + "basichelp")){
        const basicEmbed = new Discord.RichEmbed()
        .setTitle('Basic Commands')
        .addField('`!hello`', "Johnny Cash will say hello to you.")
        .addField('`!help`', "The reason you came here.")
        .addField('`!ping`', "Shows how fast i respond back.")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(basicEmbed)
    }

    if(message.content.startsWith(prefix + "musichelp")){
        const musicEmbed = new Discord.RichEmbed()
        .setTitle('Music Commands')
        .addField('`!play (link)`', "Make sure you are in Voice Channel, and insert YouTube link, and hear the lovely music!")
        .addField('`!search`', "Make sure you are in a Voice Channel, then By inputting JUST this command, wait until Johnny Cash has responded back to you, then search any music you like, Johnny Cash will then give you a range of terms from what you inputted. Simply type in the certain number which meets your style, and let Johnny Cash do the rest.")
        .addField('`!skip`', "Skip the playing song.")
        .addField('`!stop`', "Music will stop playing.")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(musicEmbed)
    }

    if(message.content.startsWith(prefix + "imagehelp")){
        const imageEmbed = new Discord.RichEmbed()
        .setTitle('Image Commands')
        .addField('`!photoshop`', "Johnny Cash will send you one of Tom's cursed photoshops.")
        .addField('`!mrtubb`', "Get an image of the man himself.")
        .addField('`!hdtubb`', "Get a HD image of Mr Tubb!")
        .addField('`!tubb2`', "Get an image of a new Mr Tubb photo!")
        .addField('`!meme`', "Get a random meme!")
        .addField('`!cursed`', "Get a random cursed image!")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(imageEmbed)

    }

    if(message.content.startsWith(prefix + "funhelp")){
        const funEmbed = new Discord.RichEmbed()
        .setTitle('Fun and Games Commands')
        .addField('`!8ball (question)`', "Ask a yes or no question, and let your fate decide...")
        .addField('`!urban (word)`', "Searches the term in the urban dictionary.")
        .addField('`!urban`', "Urban dictionary search a random search term.")
        .addField('`!wish (statement)`', "Ask Johnny Cash a wish, and see if you're lucky.")
        .addField('`!quiz`', "Do you have the brains to answer correctly to Johnny Cash's questions? Let's find out.")
        .addField('`!rps (item)`', "Play a game of Rock, Paper, Scissors with Johnny Cash!")
        .addField('`!ringoffire`', "Host a live Johnny Cash concert, where Johnny Cash himself will sing Ring Of Fire! *(lyrics sent at exact timings as recording)*")
        .addField('`!iwanttodie`', "Johnny Cash will end your pain and misery.")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(funEmbed)

    }

    if(message.content.startsWith(prefix + "adminhelp")){
        const adminEmbed = new Discord.RichEmbed()
        .setTitle('Administration Commands')
        .addField('`!warn (user)`', "Warn a user for their bad behaviour. This will send a private message to them regarding their warning.")
        .addField('`!kick (user)`', "Kick a user for their bad behaviour.")
        .addField('`!ban (user)`', "Ban a user for their bad behaviour.")
        .addField('`!peasant (user)`', "Peasant a user. **(ONLY WORKS ON CHEESE SERVER)**")
        .addField('`!fanny (user)`', "Fanny a user. **(ONLY WORKS ON CHEESE SERVER)**")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(adminEmbed)
    }
    
    if(message.content.startsWith(prefix + "levelhelp")){
        const levelEmbed = new Discord.RichEmbed()
        .setTitle('Level Commands')
        .addField('`!level`', "This will show you your current level, current XP, and how much XP you need to level up!")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(levelEmbed)
    }
    
    if(message.content.startsWith(prefix + "currencyhelp")){
        const currencyEmbed = new Discord.RichEmbed()
        .setTitle('Currency Commands')
        .addField('`!balance`', "This will show you your current balance, current cash.")
        .addField('`!balance (user)`', "This will show you another user's balance and cash.")
        .addField('`!daily`', "Claim your daily cash!")
        .addField('`!pay (user) (amount)`', "Feeling generous? Donate some cash to your friends, or keep it all to yourself.")
        .addField('`!gamble (amount)`', "Feeling lucky enough to gamble your money in the chance for some more money? Or possibly lose it all?")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(currencyEmbed)
    }
    
    if(message.content.startsWith(prefix + "educationhelp")){
        const educationEmbed = new Discord.RichEmbed()
        .setTitle('Educational Commands')
        .addField('`!fact`', "Get a random fact about me.")
        .addField('`!drugs`', "Learn about drugs and its consequences")
        .setThumbnail(image2)
        .setColor(0xF1C40F)
        message.channel.send(educationEmbed)
    }
    
    
    
    
    
    
    if(message.content.startsWith(prefix + "drugs")){
        message.channel.send("Drugs r bad. Except if ur dokter gave em to u for ur helth. \nDrygs cAn makE u fEEl uNeaSy anD noT normAl. \nadVice froM me, Johnny Cash, doNt tAke dRugs unleSs yoU arE undEr 13.")
    }
    
    
    if(message.content.startsWith(prefix + "iwanttodie")){
        message.channel.send(`Tracking ${message.author.username}'s location...`).then((sentMessage) => 
        setTimeout(() =>{
            sentMessage.edit("Location Found...").then(
                (sentMessageNew) =>
                setTimeout(() =>{
                    ranNum = Math.floor(Math.random() * (100 - 1 + 1) + 1);
                    towns = ["Oogally", "Boogally", "Czech slovakia", "BookWorm Adventures Deluxe", "Meatball", "Pasta Lane", "Papa Mama Mia", "dead", "Austria", "UK", "US", "Car dealership", "bedroom", "garlic bread shop", "Tesco", "Sainsburys", "Asda", "Argos", "Cheese and Onion", "West Northen East", "Peppa Pig World", "Discord"];
                    ranTown = towns[Math.floor(Math.random() * towns.length)];
                    countries = ["China", "India", "New Zealand", "North America", "South America", "United Kingdom", "France", "Germany", "Russia", "Austria", "Australia", "Bangladesh", "Spain", "Norway", "Netherlands", "Czech", "Poland", "Romania", "Hungary", "Mongolia", "Antarctica", "Afghanistan", "Barbados", "Madagascar", "Central Africa Republic", "Denmark", "Ghana", "Jamaica", "Khazikstan", "Laos", "Nepal", "Qatar", "Turkey", "Uruaguay", "Vitenam", "Wales", "Yemen", "Ireland"]
                    ranCountry = countries[Math.floor(Math.random() * countries.length)]; 

                    
                    sentMessageNew.edit(`Location: ${ranNum} ${ranTown}, ${ranCountry}`).then(
                        (sentMessageNew2) =>
                        setTimeout(() =>{
                            ranMiles = Math.floor(Math.random() * (999 - 1 + 1) + 1);
                            sentMessageNew2.edit(`Heading to location: ${ranMiles} miles away...`).then(
                                (sentMessageNew3) =>
                                setTimeout(() =>{
                                    sentMessageNew3.edit('Heading to location: 0 miles away...').then(
                                        (sentMessageNew4) =>
                                        setTimeout(() =>{
                                            sentMessageNew4.edit(`Breaking into ${message.author.username}'s house...`).then(
                                                (sentMessageNew5) =>
                                                setTimeout(() =>{
                                                    sentMessageNew5.edit(`Killing ${message.author.username}...`).then(
                                                        (sentMessageNew6) =>
                                                        setTimeout(() =>{
                                                            killOptions = ["peeing on them", "smacking them with my guitar", "stabbing them with a knife", "talking to them", "eating thier brain", "inviting Brian over to their house", "shooting them in the kneecaps", "setting them on fire", "choking them", "sucking blood out of them", "doing nothing", "forcing them to play Terraria", "eating their Pringles", "rubbing my nose into a can of beans", "whacking them with a mallet", "force feeding them expired garlic bread", "unsubscribing to Tongo on YouTube", "telling them how much Tom's sister hates Johnny Cash", "getting them to decode a Polybius cipher", "killing them", "chopping their toes off", "taking their CHEESE away", "taking a shower in their bathroom", "... Actually, i forgot. Oh well", "making them adicted to opium"]
                                                            randomKillOption = killOptions[Math.floor(Math.random() * killOptions.length)];
                                                            sentMessageNew6.edit(`Successfully killed ${message.author.username} by ${randomKillOption}`)
                                                        }, 3000)
                                                    )
                                                }, 3000)
                                            )
                                        }, 3000)
                                    )
                                }, 3000)
                            )

                        }, 3000)
                    )
        
                }, 3000))

        }, 3000))
        

    }
    
    
    
    
    
    
    
    
    let xpAdd = Math.floor(Math.random() * 7) + 8;
    

    if(!xp[message.author.id]){
        xp[message.author.id] = {
            xp: 0,
            level: 1
        };
    }
    
    if(message.author.bot) return

    let curxp = xp[message.author.id].xp;
    let curlevel = xp[message.author.id].level;
    let nextLevel = xp[message.author.id].level * 300;
    let nextLevelxp = curlevel * 300;
    let difference = nextLevelxp - curxp;
    xp[message.author.id].xp = curxp + xpAdd;

    if(nextLevel <= xp[message.author.id].xp){
        xp[message.author.id].level = curlevel + 1;
        
        let lvlup = new Discord.RichEmbed()
        .setTitle('Level Up!')
        .setColor('#7a34eb')
        .addField("New Level", curlevel + 1)
        .addField(`${message.author.username}`, "has leveled up!")
        message.channel.send(lvlup)
        

    }

    if(message.content.startsWith(prefix + "level")){
        let lvlEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setColor('#3614a6')
        .addField('Level:', curlevel, true)
        .addField('XP:', curxp, true)
        .setFooter(`${difference} XP till next level!`, message.author.displayAvatarURL);
        message.reply(lvlEmbed);
    }
    

    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
        if(err) console.log(err)
    });
    
    if(message.content.startsWith(prefix + "meme")){

        meme(message);
    }

    if(message.content.startsWith(prefix + "cursed")){

        cursed(message);
    }
    
    if(message.content.startsWith(prefix + "ringoffire")){
        if(message.author.bot) return
        var firstmsg = setTimeout(function(){verse1_line1(message)}, 4000)
        var secondmsg = setTimeout(function(){verse1_line2(message)}, 10000)
        var thirdmsg = setTimeout(function(){verse1_line3(message)}, 17000)
        var fourthmsg = setTimeout(function(){verse1_line4(message)}, 23000)
        var chorusmsg1 = setTimeout(function(){chorus1(message)}, 27000)
        var chorusmsg2 = setTimeout(function(){chorus2(message)}, 31000)
        var chorusmsg3 = setTimeout(function(){chorus3(message)}, 34000)
        var chorusmsg4 = setTimeout(function(){chorus4(message)}, 37500)
        var chorusmsg5 = setTimeout(function(){chorus5(message)}, 41000)
        var chorusmsg1rpt = setTimeout(function(){chorus1(message)}, 66000)
        var chorusmsg2rpt = setTimeout(function(){chorus2(message)}, 70000)
        var chorusmsg3rpt = setTimeout(function(){chorus3(message)}, 73000)
        var chorusmsg4rpt = setTimeout(function(){chorus4(message)}, 76500)
        var chorusmsg5rpt = setTimeout(function(){chorus5(message)}, 80000)
        var fifthmsg = setTimeout(function(){verse2_line1(message)}, 89000)
        var sixthmsg = setTimeout(function(){verse2_line2(message)}, 95000)
        var seventhmsg = setTimeout(function(){verse2_line3(message)}, 101500)
        var eigthmsg = setTimeout(function(){verse2_line4(message)}, 108500)
        var chorusmsg1rpt2 = setTimeout(function(){chorus1(message)}, 114000)
        var chorusmsg2rpt2 = setTimeout(function(){chorus2(message)}, 118000)
        var chorusmsg3rpt2 = setTimeout(function(){chorus3(message)}, 122000)
        var chorusmsg4rpt2 = setTimeout(function(){chorus4(message)}, 124500)
        var chorusmsg5rpt2 = setTimeout(function(){chorus5(message)}, 128000)
        var chorusmsg1rpt3 = setTimeout(function(){chorus1(message)}, 133500)
        var chorusmsg2rpt3 = setTimeout(function(){chorus2(message)}, 137500)
        var chorusmsg3rpt3 = setTimeout(function(){chorus3(message)}, 140500)
        var chorusmsg4rpt3 = setTimeout(function(){chorus4(message)}, 144000)
        var chorusmsg5rpt3 = setTimeout(function(){chorus5(message)}, 147500)
        var lastbitmsg1 = setTimeout(function(){lastbit_1(message)}, 156500)
        var lastbitmsg2 = setTimeout(function(){lastbit_2_and3(message)}, 160500)
        var lastbitmsg3 = setTimeout(function(){lastbit_2_and3(message)}, 164500)
        var lastbitmsg4 = setTimeout(function(){last_last(message)}, 168500)



        message.channel.send(`Im gonna play Ring Of Fire! This was suggested by, ${message.author.username}`).then(firstmsg).then(secondmsg).then(thirdmsg).then(fourthmsg).then(chorusmsg1).then(chorusmsg2).then(chorusmsg3).then(chorusmsg4).then(chorusmsg5).then(chorusmsg1rpt).then(chorusmsg2rpt).then(chorusmsg3rpt).then(chorusmsg4rpt).then(chorusmsg5rpt).then(fifthmsg).then(sixthmsg).then(seventhmsg).then(eigthmsg).then(chorusmsg1rpt2).then(chorusmsg2rpt2).then(chorusmsg3rpt2).then(chorusmsg4rpt2).then(chorusmsg5rpt2).then(chorusmsg1rpt3).then(chorusmsg2rpt3).then(chorusmsg3rpt3).then(chorusmsg4rpt3).then(chorusmsg5rpt3).then(lastbitmsg1).then(lastbitmsg2).then(lastbitmsg3).then(lastbitmsg4);
        
    }


    function verse1_line1(message){
        message.channel.send("Love is a burnin' thing,");
    }

    function verse1_line2(message){
        message.channel.send("And it makes a fiery ring");
    }

    function verse1_line3(message){
        message.channel.send("Bound by wild desire")
    }

    function verse1_line4(message){
        message.channel.send("I fell into a ring of fire.")
    }

    function chorus1(message){
        message.channel.send("I fell into a burnin' ring of fire")
    }

    function chorus2(message){
        message.channel.send("I went down, down, down")
    }

    function chorus3(message){
        message.channel.send("And the flames went higher,")
    }

    function chorus4(message){
        message.channel.send("And it burns, burns, burns,")
    }

    function chorus5(message){
        message.channel.send("The ring of fire, the ring of fire.")
    }

    function verse2_line1(message){
        message.channel.send("The taste of love is sweet")
    }

    function verse2_line2(message){
        message.channel.send("When hearts like ours meet.")
    }

    function verse2_line3(message){
        message.channel.send("I fell for you like a child")
    }

    function verse2_line4(message){
        message.channel.send("Oh, but the fire went wild.")
    }

    function lastbit_1(message){
        message.channel.send("And it burns, burns, burns,")
    }

    function lastbit_2_and3(message){
        message.channel.send("The ring of fire, the ring of fire.")
    }

    function last_last(message){
        message.channel.send("The ring of fire")
    }

    
    
      

        




    if (message.content.startsWith(prefix + "ping")) {
        message.channel.send(`Ring Of Fire! my Ping is ` + Math.round(Client.ping) + `ms`);
      }

    if(message.content.startsWith(prefix + "hello")){
        message.channel.send("Hello, i am Johhny Cash. How are you doing, " + message.author + " ?");

    }
    
    if(message.content.startsWith(prefix + "test")){
        message.channel.send("You have utilised a test, " + message.author + " It went through!");

    }
    
    
        

    


    

});

function meme(message){

    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "meme",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    }

    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
 
 
        $ = cheerio.load(responseBody);
 
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
 
        if (!urls.length) {
           
            return;
        }
 
        // Send result
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
};


function cursed(message){

    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "cursed image",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    }

    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
 
 
        $ = cheerio.load(responseBody);
 
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
 
        if (!urls.length) {
           
            return;
        }
 
        // Send result
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
};

    




Client.login(process.env.BOT_TOKEN);
