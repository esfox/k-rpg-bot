const Discord = require('discord.js');
const bot = new Discord.Client();

const { Koins } = require('./modules/koins');
const { Mod } = require('./modules/mod');

const [ token ] = process.argv.slice(2);
bot
  .login(token)
  .catch(console.error);

bot.on('ready', () =>
{
  console.log('Bot connected.');
});

bot.on('message', message =>
{
  new Koins(message);
  new Mod(message);
});
