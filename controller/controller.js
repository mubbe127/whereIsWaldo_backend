import characters from "../utils/characters.js";
import prisma from "../model/prismaClient.js";

async function gameOver(req, res) {
  const gameEndTime = Date.now();
  const gameTime = (gameEndTime - req.session.gameStartTime) / 1000;
  const foundCharacters = req.session.foundCharacters;
  console.log(gameTime);
  const { highscore, userscore } = await getScore(gameTime);
  req.session.highscore = highscore;
  req.session.userscore = userscore;
  req.session.gameOver = true;
  res.status(201).json({
    foundCharacters,
    userscore,
    highscore,
    foundCharacter: foundCharacters[2],
    gameOver: req.session.gameOver,
    message: "Game over",
  });
}

async function getScore(gameTime) {
  try {
    const userscore = await prisma.score.create({
      data: {
        gameTime: gameTime,
      },
    });

    const highscore = await prisma.score.findMany({
      orderBy: {
        gameTime: "asc",
      },
      take: 5,
    });

    highscore.forEach((score, index) => {
      if (score.id === userscore.id) {
        userscore.rank = index + 1;
      }
    });

    console.log(highscore);
    console.log(userscore);

    return { userscore, highscore };
  } catch (error) {
    console.log(error);
  }
}

// controllers //

const storeUsername = async (req, res) => {
  const { username, id } = req.body;
  try {
    const updateScore = await prisma.score.update({
      where: { id },
      data: {
        username,
      },
    });
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(403).json({ message: "failed update user" });
  }
};
const checkPosition = async (req, res) => {
  console.log("Req body", req.body, req.session);
  console.log("hej")
  
  const { position, characterId } = req.body;
  let foundCharacter;
  const gameId = Number(req.params.gameId )
  const gameCharacters = gameId===1 ? characters.universe11 : characters.cyberpunkCity
  gameCharacters.forEach((character) => {
    if (
      Number(characterId) === character.id &&
      position[1] < character.position.yBorder[1] &&
      position[1] > character.position.yBorder[0] &&
      position[0] < character.position.xBorder[1] &&
      position[0] > character.position.xBorder[0]
    ) {
      foundCharacter = character;
      console.log(foundCharacter)
     
      if (
        !req.session.foundCharacters.some(
          (character) => character.id === foundCharacter.id
        )
      ) {
        req.session.foundCharacters.push(foundCharacter);
      }
    }
  });
  if (req.session.foundCharacters.length === 3) {
    gameOver(req, res);
  } else if (foundCharacter) {
    res.status(201).json({
      foundCharacter,
      foundCharacters: req.session.foundCharacters,
      message: `You found character with id: ${foundCharacter.id}`,
    });
  } else {
    res.status(201).json({
      foundCharacters: req.session.foundCharacters,
      message: "No character found",
    });
  }
};

const startGame = async (req, res) => {
 
  function randomCharacters(gameId) {
    console.log("gameID", gameId)
    const gameCharacters = gameId===1 ? characters.universe11 : characters.cyberpunkCity
    const number = gameId===1 ? 14 : 3; 
    let array = [];

    while (array.length < 3) {
      const randomNumber = Math.floor(Math.random() * number);
      if (!array.some((character) => character.id === randomNumber)) {
        const { id, name } = gameCharacters[randomNumber];
        const character = { id, name };
        console.log(character)
        array.push(character);
      }
    }
    return array;
  }
  console.log(req.session);
  if (req.session.existingGame) {
    const gameCharacters = req.session.gameCharacters;
    const foundCharacters = req.session.foundCharacters || [];
    const userscore = req.session.userscore || false;
    const highscore = req.session.highscore || false;
    const gameOver = req.session.gameOver || false;
    const gameStartTime = req.session.gameStartTime
    const existingGame = req.session.existingGame
    

    res.status(201).json({
      gameOver,
      gameCharacters,
      foundCharacters,
      highscore,
      userscore,
      message: "Existing game running",
      gameStartTime,
      existingGame,

    });
  } else {
    const gameId = Number(req.params.gameId)
    console.log("Start game");
    console.log("Setting req", req.session);
    req.session.existingGame = true;
    req.session.foundCharacters = [];
    const foundCharacters = req.session.foundCharacters;
    const gameCharacters = randomCharacters(gameId);
    req.session.gameCharacters = gameCharacters;
    console.log(gameCharacters);
    const gameStartTime = Date.now();
    req.session.gameStartTime = gameStartTime;

    res
      .status(201)
      .json({ gameCharacters, foundCharacters, message: "Game started", newGame: true, gameStartTime });
  }
};


export { checkPosition, startGame, storeUsername };
