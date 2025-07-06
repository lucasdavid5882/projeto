const request = require('supertest');
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbTest'); // this uses SQLite


// Create in-memory DB
// const sequelize = new Sequelize('sqlite::memory:', { logging: false });

// Import and inject models
const Game = require('../models/game')(sequelize);
const CharacterGame = require('../models/characterGame')(sequelize, Game);

// Set up express app
const characterRoutes = require('../routes/characterRoutes')(CharacterGame, Game);
const app = express();
app.use(express.json());
app.use('/character', characterRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const game = await Game.create({
    gameId: 1,
    name: 'tk8',
    version: '1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: 1
  });

  await CharacterGame.create({
    characterGameId: 1,
    name: 'Kazuya',
    picture: 'kazuya.png',
    gameId: game.gameId,
    createdAt: new Date(),
    updatedAt: new Date(),
    active: 1
  });
});

describe('GET /character/:gameName', () => {
  it('should return characters for a given game name', async () => {
    const res = await request(app).get('/character/tk8');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Kazuya');
    // expect(res.body[0].picture).toContain('kazuya.png');
  });

  it('should return picture url', async () => {

    const character = await CharacterGame.create({
        characterGameId: 2,
        name: 'Jin',
        picture: 'jin',
        gameId: 1,
        createdAt: new Date(),
        active: 1
      });

      const character2 = await CharacterGame.create({
        characterGameId: 3,
        name: 'Asuka',
        gameId: 1,
        createdAt: new Date(),
        active: 1
      });

    // expect(res.statusCode).toBe(200);
    // expect(res.body.length).toBeGreaterThan(0);
    // expect(res.body[0].pictureUrl).toContain('kazuya.png');
    const url = character.pictureUrl;
    const url2 = character2.pictureUrl;
    expect(url).toBe(`${process.env.URLPATH}/jin.png`);
    expect(url2).toBe(null);
  });

  it('should return 404 for a non-existent game', async () => {
    const res = await request(app).get('/character/nonexistent');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/No characters found/);
  });
});