const Discord = require('discord.js');
const bot = new Discord.Client();

const { Dev } = require('./modules/dev');
const { Mod } = require('./modules/mod');
const { Koins } = require('./modules/koins');
const { General } = require('./modules/general');

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
  if(message.author.bot)
    return;

  new Dev(message);
  new Mod(message);
  new General(message);
  new Koins(message);
});
