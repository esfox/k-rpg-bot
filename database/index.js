const Sequelize = require('sequelize');

/** @type {import('sequelize').Sequelize} */
const sequelize = new Sequelize(
  {
    dialect: 'sqlite',
    storage: './database/database.sqlite',
  }
);

// sequelize.sync({ force: true }).catch(console.error);
sequelize.sync().catch(console.error);

exports.modelOptions =
{
  sequelize,
  underscored: true,
  timestamps: false,
};
