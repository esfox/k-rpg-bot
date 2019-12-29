const { sendEmbed, getCommand } = require('../../helpers');
const { readFileSync } = require('fs');

class General
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
      case 'ping':
        this.ping();
        break;

      case 'help':
        this.help();
        break;
    }
  }

  ping()
  {
    sendEmbed(this.message, { title: `📶  ${~~(this.message.client.ping)} ms` });
  }

  help()
  {;
    const description = readFileSync(`${__dirname}/help`).toString();
    sendEmbed(this.message, { description });
  }
}

exports.General = General;
