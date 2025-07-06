const fs = require('fs');
const path = require('path');
const express = require('express');
var cors = require('cors')
require('dotenv').config();
const { createSequelizeInstance } = require('./db');


const GameFactory = require('./models/game'); // Assume it’s written similarly
const CharacterGameFactory = require('./models/characterGame');
const moveFactory = require('./models/move');
const characterRoutesFactory = require('./routes/characterRoutes'); 
const characterGame = require('./models/characterGame');

const app = express();
app.use('/images', express.static(path.join(__dirname, 'pictures')));
app.use(cors())
const sequelize = createSequelizeInstance(process.env.CONNECTION);

// Initialize models
const Game = GameFactory(sequelize);
const CharacterGame = CharacterGameFactory(sequelize, Game);
const Move = moveFactory(sequelize, Game, CharacterGame);

// Initialize routes
const characterRoutes = characterRoutesFactory(CharacterGame,Game,Move);

app.use(express.json());
app.use('/character', characterRoutes);

// 404 fallback
app.all('/{*any}', function(req, res){
	res.status(404).json({"result":"essa página não existe"});
  });

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  const logPath = path.join(__dirname, 'errorlog.txt');
  const logMessage = `[${new Date().toISOString()}] ${err.stack || err}\n`;

  fs.appendFile(logPath, logMessage, (fileErr) => {
    if (fileErr) {
      console.error('Error writing to errorlog.txt:', fileErr);
    }
  });

  res.status(500).json({ message: "Internal server error" });
});

// Start server
const Port = process.env.PORT || 3001;
app.listen(Port, () => {
  console.log(`Connected, running on port ${Port}`);
});
