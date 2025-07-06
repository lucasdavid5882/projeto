// routes/characterRoutes.js
const express = require('express');

module.exports = (CharacterGameModel,GameModel,MoveModel) => {
  const router = express.Router();

  router.get('/:gameName', async (req, res) => {
    const gameName = req.params.gameName;

    
    // Find characters whose related Game has the specified name
    const characters = await CharacterGameModel.findAll({
      include: {
        model: GameModel,
        where: { name: gameName },
        attributes: [] // Exclude game details from result if not needed
      }
    });

    if (characters.length === 0) {
      return res.status(404).json({ message: `No characters found for game '${gameName}'` });
    }

    res.status(200).json(characters);
  });

  router.get('/:gameName/:character', async (req, res) => {
    const { gameName, character } = req.params;

    const moves = await MoveModel.findAll({
      include: [
        {
          model: CharacterGameModel,
          where: { name: character },
          attributes: [] // Exclude character data if not needed
        },
        {
          model: GameModel,
          where: { name: gameName },
          attributes: [] // Exclude game data if not needed
        }
      ]
    });

    if (moves.length === 0) {
      return res.status(404).json({ message: `No moves found for ${character} in game ${gameName}` });
    }

    res.status(200).json(moves);
    
  });

  return router;
};
