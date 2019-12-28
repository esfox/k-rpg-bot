const
{
  sendEmbed,
  getCommand,
  getParams,
  getMentionedUser,
} = require('../../helpers');

const { Users } = require('../../database/models/users');

class Mod
{
  /** @param {import('discord.js').Message} message */
  constructor(message)
  {
    this.message = message;

    const command = getCommand(message);
    if(!command)
      return;

    switch(command)
    {
      case 'addkoins':
        this.addKoins();
        break;
    }
  }
  
  async addKoins()
  {
    const [ , amount ] = getParams(this.message);

    let user = getMentionedUser(this.message);
    if(!user)
      return sendEmbed(this.message,
        { title: '❌  Please mention the user to add koins to.' });

    if(!amount)
      return sendEmbed(this.message,
        { title: '❌  Please include how much koins to add.' });
    
    user = user.id;
    const result = await Users.addUserKoins(user, amount);
    if(!result)
      return sendEmbed(this.message,
        { title: '❌  An error occurred. Please try again.' });

    sendEmbed(this.message,
      { description: `💰  Added ${amount} koins to <@${user}>.` });
  }
}

exports.Mod = Mod;
