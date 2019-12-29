const { sendEmbed, getCommand } = require('../../helpers');
const { readFileSync } = require('fs');

const commands =
{
  ping: 'ping',
  help: 'help'
};

class General
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
      case commands.ping:
        this.ping();
        break;

      case commands.help:
        this.help();
        break;
    }
  }

  // Shows the ping of the bot.
  ping()
  {
    sendEmbed(this.message, { title: `📶  ${~~(this.message.client.ping)} ms` });
  }

  // Shows the help message.
  help()
  {
    const description = readFileSync(`${__dirname}/help`).toString();
    sendEmbed(this.message, { description });
  }
}

exports.General = General;
