const { RichEmbed } = require('discord.js');
const { prefix, embed_color } = require('./config');

/** 
 * @description Sends an embed in the channel the message was sent in.
 * 
 * @param {import('discord.js').Message} message
 * @param {import('discord.js').RichEmbedOptions} options
 * */
exports.sendEmbed = (message, options) =>
{
  const embed = new RichEmbed(options)
    .setColor(embed_color);

  if(options.reply)
    return message.reply(embed);
  
  message.channel.send(embed);
}

/** 
 * @description Gets the command from the message.
 * 
 * @param {import('discord.js').Message} message 
 * */
exports.getCommand = message =>
{
  let { content } = message;
  if(!content.startsWith(prefix))
    return;

  content = content.substr(prefix.length);
  return content.split(' ').shift();
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
