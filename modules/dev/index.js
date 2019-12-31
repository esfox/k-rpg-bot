const
{
  sendEmbed,
  getCommand,
  getParams,
  saveConfig,
} = require('../../helpers');

const config = require('../../config');

const commands =
{
  addmod: 'addmod',
  removemod: 'removemod',
};

class Dev
{
  /** @param {import('discord.js').Message} message */
  constructor(message)
  {
    this.message = message;

    const command = getCommand(message, commands);
    if(!command)
      return;

    if(message.author.id !== config.developer)
      return sendEmbed(message,
        { title: '❌  You are not allowed to use this command.' });

    switch(command)
    {
      case commands.addmod:
        this.addMod();
        break;

      case commands.removemod: 
        this.removeMod();
        break;
    }
  }
  
  // Add a role to be eligible to use the Mod module
  addMod()
  {
    const [ role ] = getParams(this.message);
    if(!this.message.guild.roles.get(role))
      return sendEmbed(this.message,
        { title: '❌  That is not a valid role ID.' });

    if(config.mod_roles.includes(role))
      return sendEmbed(this.message,
        { title: 'That role already has moderator permissions.' });

    config.mod_roles.push(role);
    saveConfig(config);
    sendEmbed(this.message,
      { description: `✅  Added moderator permissions to <@&${role}>.` });
  }

  // Remove a role to be eligible to use the Mod module
  removeMod()
  {
    const [ role ] = getParams(this.message);
    if(!config.mod_roles.includes(role))
      return sendEmbed(this.message,
        { title: '❌  That role does not have moderator permissions.' });

    config.mod_roles = config.mod_roles.filter(mod_role => mod_role !== role);
    saveConfig(config);
    sendEmbed(this.message,
      { description: `⛔  Removed moderator permissions to <@&${role}>.` });
  }
}

exports.Dev = Dev;
