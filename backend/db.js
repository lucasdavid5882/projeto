// src/db.js
const { Sequelize } = require('sequelize');

function createSequelizeInstance(connectionString) {
  const sequelize = new Sequelize(connectionString);
  
  sequelize.sync({ force: false })
    .then(() => console.log('Database synchronized'))
    .catch((error) => console.error('Failed to synchronize database:', error));
  
  return sequelize;
}

module.exports = { createSequelizeInstance };
