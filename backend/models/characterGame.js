// models/characterGame.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, GameModel) => {
  const CharacterGame = sequelize.define('charactergame', {
    characterGameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pictureUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        const picture = this.getDataValue('picture');
        return picture ? `${process.env.URLPATH}/${picture}.png` : null;
      }
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GameModel,
        key: 'gameId'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'charactergame',
    timestamps: false
  });

  CharacterGame.belongsTo(GameModel, { foreignKey: 'gameId' });

  return CharacterGame;
};
