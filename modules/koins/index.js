const { sendEmbed, getCommand, getMentionedUser } = require('../../helpers');
const { Users } = require('../../database/models/users');

const commands =
{
  koins: 'koins',
  k: 'k',
};

class Koins
{
  /** @param {import('discord.js').Message} message */
  constructor(message)
  {
    this.message = message;

    const command = getCommand(message, commands);
    if(!command)
      return;

    switch(command)
    {
      case commands.koins:
      case commands.k:
        this.koins();
        break;
    }
  }
  
  // Shows the current koins of the user or a mentioned user.
  async koins()
  {
    let user = getMentionedUser(this.message);

    const koins = await Users.getUserKoins(user?
      user.id : this.message.author.id);
      
    sendEmbed(this.message,
    {
      title: `💰  Koins: ${koins || 0}`,
      author: !user? undefined :
      {
        name: user.username,
        icon_url: user.displayAvatarURL,
      },
      reply: user === undefined,
    });
  }
}

exports.Koins = Koins;
