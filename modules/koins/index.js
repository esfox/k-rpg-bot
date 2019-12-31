const { sendEmbed, getCommand, getMentionedUser } = require('../../helpers');
const { Users } = require('../../database/models/users');
const config = require('../../config');

const commands =
{
  koins: 'koins',
  k: 'k',
  koinstop: 'koinstop',
  ktop: 'ktop',
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

      case commands.leaderboard:
      case commands.ktop:
        this.userLeaderboard();
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

  // Shows the top 10 users with most koins
  async userLeaderboard()
  {
    let koins = await Users.getAll();
    koins = koins
      .filter(({ user }) => this.message.guild.member(user))
      .filter(({ user }) =>
        this.message.guild.member(user).roles.every(role =>
          !config.mod_roles.includes(role.id)))
      .slice(0, 10)
      .reduce((table, { user, koins }, i) =>
        table + `#${i + 1}`.padEnd(5, ' ')
          + `${this.message.client.users.get(user)
            .tag.substr(0, 18).padEnd(19, ' ')} `
          + `${koins.toLocaleString()}\n`, '');

    const leaderboard = `💰 **Koins Leaderboard**`
      + '```css\n' + koins  + ' ```';
    this.message.channel.send(leaderboard);
  }
}

exports.Koins = Koins;
