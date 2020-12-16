const SnakeGame = require('snakecord');
const Discord = require("discord.js");

const snakeGame = new SnakeGame({
    title: 'Snake Game',
    color: "GREEN",
    timestamp: false,
    gameOverTitle: "Game Over"
})

module.exports.run = async (Client, message, args) => {
    snakeGame.newGame(message)

}

module.exports.help = {
    name: 'snake',
    aliases: []
};
