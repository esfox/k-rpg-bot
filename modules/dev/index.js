const
{
  sendEmbed,
  getCommand,
  getParams,
  saveConfig,
} = require('../../helpers');
const config = require('../../config');

class Dev
{
  /** @param {import('discord.js').Message} message */
  constructor(message)
  {
    this.message = message;

    const command = getCommand(message);
    if(!command)
      return;

    if(message.author.id !== config.developer)
      return sendEmbed(message,
        { title: '❌  You are not allowed to use this command.' });

    switch(command)
    {
      case 'addmod':
        this.addMod();
        break;
    }
  }
  
  // Add a role to be eligible to use the Mod module
  addMod()
  {
    const [ role ] = getParams(this.message);

    saveConfig(config);
    sendEmbed(this.message, { title: 'Check console.' });
  }
}

exports.Dev = Dev;
