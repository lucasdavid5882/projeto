// models/move.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize, GameModel, CharacterGameModel) => {
  const Move = sequelize.define('Move', {
    moveId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    command: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hitLevel: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    damage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    startUpFrame: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    blockFrame: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hitFrame: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    counterHitFrame: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    characterGameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'move',
    timestamps: false
  });

  // Define associations
  Move.belongsTo(GameModel, { foreignKey: 'gameId' });
  Move.belongsTo(CharacterGameModel, { foreignKey: 'characterGameId' });

  return Move;
};
