const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const GENIUS_CLIENT = process.env.GENIUS_CLIENT
const baseURL = `https://api.genius.com/search?access_token=${GENIUS_CLIENT}`;
let playlist;

const scrapeLyrics = path => {
  return axios.get(path)
    .then(response => {
      let $ = cheerio.load(response.data);
      return [$('.header_with_cover_art-primary_info-title').text().trim(), $('.lyrics').text().trim()];
    })
    .catch(err => {
      console.warn(err);
    });
};

const searchLyrics = url => {
  return Promise.resolve(axios.get(url, {'Authorization': `Bearer ${GENIUS_CLIENT}`})
    .then(response => checkSpotify(response.data.response.hits))
    .then(path => scrapeLyrics(path))
    .catch(err => {
      console.warn(err);
    })
  );
};

const checkSpotify = hits => {
  return hits[0].result.primary_artist.name === 'Spotify' ? hits[1].result.url : hits[0].result.url;
};


module.exports.run = async (Client, message, args) => {
  playlist = Client.playlist;

  if (!args[0]) return message.reply("Please specify a search query");
  message.channel.send("Fetching results. This may take a few seconds...");

  const query = args.slice(0).join(' ');
  searchLyrics(`${baseURL}&q=${encodeURIComponent(query)}`)
    .then(songData => {
      const embed = new Discord.MessageEmbed()
        .setColor(0x00AE86)
        if(songData[0] && songData[1]){
          embed.setTitle(`Lyrics for: ${songData[0]}`)
          embed.setDescription(songData[1]);
        }else{
          return message.channel.send("`Error while fetching results. Please try again`")
        }
      return message.channel.send({embed});
    })
    .catch(err => {
      message.channel.send(`No lyrics found for: ${query} 🙁`, {code:'asciidoc'});
      console.warn(err);
    });
};

module.exports.help = {
  name: 'lyrics',
  aliases: []
};
