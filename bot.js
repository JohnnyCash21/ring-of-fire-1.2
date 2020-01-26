const Discord = require("discord.js");
const Client = new Discord.Client();
const prefix = "!";
const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 1 };
const urban = require("urban");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
var version = '1.2';
var servers = {};






Client.on('ready', ()=>{
    console.log("Bot is online.");
    Client.user.setActivity('with my guitar | use "!help"');
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
    
    switch (args[0]) {
    case "urban":       
        if(args <1 && !["random", "search"].includes(args[0])) return message.channel.send("The correct usage is `!urban (query) | random option - !urban`")
        let image2 = "https://retrorambling.files.wordpress.com/2013/12/312_johnny-cash.jpg"
        let search = args[1] ? urban(args.slice(1).join(" ")) : urban.random();
            try {
                search.first(res => {
                  if(!res) return message.channel.send(`No results found for this topic, sorry!`)
                  let { word, definition, example, thumbs_up, thumbs_down, permalink, author} = res

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
                })
            } catch(e) {
                console.log(e)
                return message.channel.send("I'm broken, Try again!")
            }
      break;
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
    ];





if(message.content.startsWith(prefix + "image")){
        photonumber = 43;

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

    
    
   
    const command = args.shift().toLowerCase();




    if (command === "ping") {
        message.channel.send(`Ring Of Fire! my Ping is ` + Math.round(Client.ping) + `ms`);
      }

    if(message.content.startsWith(prefix + "hello")){
        message.channel.send("Hello, i am Johhny Cash. How are you doing, " + message.author + " ?");

    }

    if(message.content.startsWith(prefix + "help")){
        message.channel.send("Check your Private Messages");
        message.author.send("Hello, \n **!hello** - you will be able to speak to me! \n **!help** - the reason you came here \n **!ping** - Shows how fast i respond back \n **!play (link)** - Make sure you are in Voice Channel, and insert YouTube link, and hear the lovely music!; \n **!skip** - Skip the playing song \n **!stop** - Johnny Cash will leave the Voice Channel \n \n **!image** - Johnny Cash will send you one of Tom's cursed photoshops \n **!8ball** - ask a yes or no question, and let your fate decide... \n **!fact** - Get a random fact about me. \n **!mrtubb** - Get an image of the man himself.");

        
    }


    

})

    




Client.login(process.env.BOT_TOKEN);
