const { RichEmbed } = require('discord.js');
const config = require('./config');
const fs = require('fs');

/** 
 * @description Sends an embed in the channel the message was sent in.
 * 
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').RichEmbedOptions} options
 * */
exports.sendEmbed = (message, options) =>
{
  const embed = new RichEmbed(options)
    .setColor(config.embed_color);

  if(options.reply)
    return message.reply(embed);
  
  message.channel.send(embed);
}

/** 
 * @description Gets the command from the message.
 * 
 * @param {import('discord.js').Message} message 
 * @param {object} commands
 * */
exports.getCommand = (message, commands) =>
{
  commands = Object.values(commands);
  if(!Array.isArray(commands))
    return;

  let { content } = message;
  if(!content.startsWith(config.prefix))
    return;

  content = content.substr(config.prefix.length);
  const command = content.split(' ').shift();

  if(!commands.includes(command))
    return;

  return command;
}

/**
 * @description Gets the command parameters from a message.
 * 
 * @param {import('discord.js').Message} message
 */
exports.getParams = message =>
{
  return message.content
    .replace(/\s+/g, ' ')
    .split(' ')
    .splice(1);
}

/**
 * @description Gets the mentioned user from the message.
 * 
 * @param {import('discord.js').Message} message
 */
exports.getMentionedUser = message =>
{
  const [ discordID ] = this.getParams(message);

  let user = message.mentions.users.first();
  if(!user)
    user = message.client.users.get(discordID);

  return user;
}

/** @description Save a new config. */
exports.saveConfig = newConfig =>
  fs.writeFileSync('./config.js',
    'module.exports =\n' + JSON.stringify(newConfig, null, 2));
