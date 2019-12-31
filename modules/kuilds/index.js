const { readFileSync } = require('fs');

const
{
  sendEmbed,
  getCommand,
} = require('../../helpers');
const config = require('../../config');

const commands =
{
  kuilds: 'kuilds',
  members: 'members',
};

const kuildsFile = config.kuilds_path;

class Kuilds
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
      case commands.kuilds:
        this.kuilds();
        break;

      case commands.members:
        this.kuildMembers();
        break;
    }
  }

  kuilds()
  {
    const kuilds = getKuilds()
      .map(kuild => this.message.guild.roles.get(kuild))
      .join('\n');

    sendEmbed(this.message,
      {
        title: '🛡  Kuilds',
        description: kuilds,
        fields:
        [
          {
            name: 'Joining a Kuild',
            value: 'Message or mention any member'
              + ' of that kuild and ask to join.\n'
              + 'To check the members of that kuild, check the members list'
              + ' or do `;members @kuild-role.',
          }
        ]
      });
  }

  kuildMembers()
  {
    const kuild = this.message.mentions.roles.first();
    if(!kuild)
      return sendEmbed(this.message,
        { title: '❌  Please mention the role of the kuild.' });

    if(!getKuilds().includes(kuild.id))
      return sendEmbed(this.message,
        { title: '❌  That role is not a kuild role.' });

    const members = kuild.members.array().join(' ');
    sendEmbed(this.message,
      {
        description: `**Members of ${kuild}**\n\n`
          + members
      });
  }
}

exports.Kuilds = Kuilds;

/** @returns {string[]} */
function getKuilds()
{
  const kuildsJSON = readFileSync(kuildsFile).toString();
  return JSON.parse(kuildsJSON);
}
