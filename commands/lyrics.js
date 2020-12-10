const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const settings = require('../settings.json');

const baseURL = `https://api.genius.com/search?access_token=${settings.GENIUS}`;
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
  return Promise.resolve(axios.get(url, {'Authorization': `Bearer ${settings.GENIUS}`})
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

  const query = args.slice(0).join(' ');
  searchLyrics(`${baseURL}&q=${encodeURIComponent(query)}`)
    .then(songData => {
      const embed = new Discord.MessageEmbed()
        .setColor(0x00AE86)
        .setTitle(`Lyrics for: ${songData[0]}`)
        .setDescription(songData[1]);
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
