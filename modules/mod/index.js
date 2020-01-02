const { readFileSync, writeFileSync } = require('fs');

const
{
  sendEmbed,
  getCommand,
  getParams,
  getMentionedUser,
} = require('../../helpers');
const config = require('../../config');
const { Users } = require('../../database/models/users');

const commands =
{
  addkoins: 'addkoins',
  addkuild: 'addkuild',
  removekuild: 'removekuild',
};

const kuildsFile = config.kuilds_path;

class Mod
{
  /** @param {import('discord.js').Message} message */
  constructor(message)
  {
    this.message = message;

    const command = getCommand(message, commands);
    if(!command)
      return;

    if(config.mod_roles.every(role => !message.member.roles.get(role)))
      return sendEmbed(message,
        { title: '❌  You are not allowed to use this command.' });

    switch(command)
    {
      case commands.addkoins:
        this.addKoins();
        break;

      case commands.addkuild:
        this.saveKuild();
        break;
      
      case commands.removekuild:
        this.saveKuild(true);
        break;
    }
  }
  
  // Add koins to a user
  async addKoins()
  {
    const [ , amount ] = getParams(this.message);

    if(!amount)
      return sendEmbed(this.message,
        { title: '❌  Please include how much koins to add.' });

    const kuild = this.message.mentions.roles.first();
    if(kuild)
    {
      const members = kuild.members
        .filter(member => kuild.guild.member(member.id))
        .map(({ id }) => id);

      Users.batchAddKoins(members, amount);
      return sendEmbed(this.message,
        { description: `💰  Added **${amount} koins** to all members of`
          + ` ${kuild}.` });
    }

    let user = getMentionedUser(this.message);
    if(!user)
      return sendEmbed(this.message,
        { title: '❌  Please mention the user to add koins to.' });
    
    const result = await Users.addUserKoins(user.id, amount);
    if(!result)
      return sendEmbed(this.message,
        { title: '❌  An error occurred. Please try again.' });

    sendEmbed(this.message,
      { description: `💰  Added **${amount} koins** to ${user}.` });
  }

  saveKuild(toRemove)
  {
    const kuildRole = this.message.mentions.roles.first();
    if(!kuildRole)
      return sendEmbed(this.message,
        { title: '❌  Please mention the role of the kuild.' });

    const kuild = kuildRole.id;
    const kuildsJSON = readFileSync(kuildsFile).toString();
  
    /** @type {string[]} */
    let kuilds = JSON.parse(kuildsJSON);
  
    if(toRemove)
    {
      if(kuilds.includes(kuild))
        kuilds = kuilds.filter(id => id !== kuild);
    }
    else
      kuilds.push(kuild);
  
    writeFileSync(kuildsFile, JSON.stringify(kuilds, null, 2));
    sendEmbed(this.message, { description:
        !toRemove?
          `✅  Successfully added <@&${kuild}> to kuilds.` :
          `⛔  Successfully removed <@&${kuild}> from kuilds.` });
  }
}

exports.Mod = Mod;
