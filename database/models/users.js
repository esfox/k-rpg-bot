const { Model, DataTypes } = require('sequelize');
const { modelOptions } = require('..');

class Users extends Model
{
  static async getUserKoins(discord_id)
  {
    const user = await Users.findOne(
      {
        attributes: [ 'koins' ],
        where: { discord_id },
      }
    );

    return user.koins;
  }

  static async addUserKoins(discord_id, amount)
  {
    const whereDiscordID = { where: { discord_id } };
    const user = await Users.findOne(
      {
        attributes: [ 'koins' ],
        ...whereDiscordID,
      }
    );

    if(!user)
      return Users.findOrCreate(
        {
          where: { discord_id },
          defaults: { koins: amount }
        },
      );

    const koins = user.koins + parseInt(amount);
    return Users.update({ koins }, whereDiscordID);
  }
}

Users.init(
  {
    discord_id: DataTypes.STRING,
    koins: DataTypes.INTEGER,
  },
  {
    ...modelOptions,
    indexes:
    [
      {
        unique: true,
        fields: [ 'discord_id' ],
      }
    ]
  }
);

exports.Users = Users;
