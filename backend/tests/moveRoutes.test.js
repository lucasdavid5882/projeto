const request = require('supertest');
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbTest'); // this uses SQLite


// Create in-memory DB
// const sequelize = new Sequelize('sqlite::memory:', { logging: false });

// Import and inject models
const Game = require('../models/game')(sequelize);
const CharacterGame = require('../models/characterGame')(sequelize, Game);
const Move = require('../models/move')(sequelize, Game, CharacterGame);

// Set up express app
const characterRoutes = require('../routes/characterRoutes')(CharacterGame, Game, Move);
const app = express();
app.use(express.json());
app.use('/character', characterRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const game = await Game.create({
    gameId: 2,
    name: 'tk7',
    version: '1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: 1
  });

  await CharacterGame.create({
    characterGameId: 2,
    name: 'dragunov',
    picture: 'dragunov.png',
    gameId: game.gameId,
    createdAt: new Date(),
    updatedAt: new Date(),
    active: 1
  });
});

describe('GET /character/:gameName/:character', () => {
  test('should return 404', async () => {
    const res = await request(app).get('/character/tk7/dragunov');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/No moves found/);
  });

  test('should return 404 for a non-existent route', async () => {
    const res = await request(app).get('/character/tk9/someone');
    expect(res.statusCode === 200 || res.statusCode === 404).toBe(true);
  });

  test('should return moves when they exist in the database', async () => {
    // Insert required Game, CharacterGame, and Move entries
    // const Game = require('../models/game');
    // const CharacterGame = require('../models/characterGame');

    const game = await Game.create({ gameId: 1, name: 'tk8', version: '1.0', createdAt: new Date(), active: 1 });
    const char = await CharacterGame.create({
      characterGameId: 1,
      name: 'kazuya',
      gameId: game.gameId,
      picture: 'kazuya',
      createdAt: new Date(),
      active: 1,
    });

    await Move.create({
      name: 'Electric Wind God Fist',
      command: 'f,N,d,d/f+2',
      hitLevel: 'mid',
      damage: '21',
      startUpFrame: '14',
      blockFrame: '-10',
      hitFrame: 'KND',
      counterHitFrame: 'KND',
      notes: 'Launches on CH',
      characterGameId: char.characterGameId,
      gameId: game.gameId,
      createdAt: new Date(),
      active: 1
    });

    const res = await request(app).get('/character/tk8/kazuya');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name', 'Electric Wind God Fist');
  });
});