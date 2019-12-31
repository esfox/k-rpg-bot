const { Model, DataTypes, Op } = require('sequelize');
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

    if(!user)
      return;

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

  static async getAll()
  {
    const users = await Users.findAll(
    {
      attributes: [ 'discord_id', 'koins' ],
      where: { koins: { [Op.not]: 0 } },
      order: [ [ 'koins', 'DESC' ] ],
    });

    return users.map(user =>
    ({
      user: user.discord_id,
      koins: user.koins
    }));
  }

  static async reset()
  {
    return Users.sequelize.query('delete from users');
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
