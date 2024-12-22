import characters from "../utils/characters.js";
import prisma from "../model/prismaClient.js";


// ADD LOGIC FOR STORING GAME DATA IN SESSION BETWEEN DIFFERENT GAMES RUNNING AT SAME TIME 

async function gameOver(req, res) {
  const gameId = Number(req.params.gameId )
  let gameSession;
  if(gameId===1){
   gameSession= req.session.universe11
  } else {
    gameSession = req.session.cyberpunkCity
  }
  const gameEndTime = Date.now();
  const gameTime = (gameEndTime -  gameSession.gameStartTime) / 1000;
  const foundCharacters = gameSession.foundCharacters;
  console.log(gameTime);
  const { highscore, userscore } = await getScore(gameTime);
 gameSession.highscore = highscore;
 gameSession.userscore = userscore;
 gameSession.gameOver = true;
  res.status(201).json({
    foundCharacters,
    userscore,
    highscore,
    foundCharacter: foundCharacters[2],
    gameOver:  gameSession.gameOver,
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

  console.log("hej")
  const gameId = Number(req.params.gameId )
  let gameSession;
  if(gameId===1){
   gameSession= req.session.universe11
  } else {
    gameSession = req.session.cyberpunkCity
  }
  console.log("Req body", req.body, gameSession);
  const { position, characterId } = req.body;
  let foundCharacter;
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
        !gameSession.foundCharacters.some(
          (character) => character.id === foundCharacter.id
        )
      ) {
        gameSession.foundCharacters.push(foundCharacter);
      }
    }
  });
  if (gameSession.foundCharacters.length === 3) {
    gameOver(req, res);
  } else if (foundCharacter) {
    res.status(201).json({
      foundCharacter,
      foundCharacters: gameSession.foundCharacters,
      message: `You found character with id: ${foundCharacter.id}`,
    });
  } else {
    res.status(201).json({
      foundCharacters: gameSession.foundCharacters,
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
  const gameId = Number(req.params.gameId )
  if (!req.session.universe11) {
    console.log("reset universe session")
    req.session.universe11 = {}
  }

  if(!req.session.cyberpunkCity){
    console.log("reset cyber session")
    req.session.cyberpunkCity= {}
  }
  let gameSession;
  if(gameId===1){
   gameSession= req.session.universe11
  } else {
    gameSession = req.session.cyberpunkCity
  }
 

  if (gameSession.existingGame) {
    const gameCharacters = gameSession.gameCharacters;
    const foundCharacters = gameSession.foundCharacters || [];
    const userscore = gameSession.userscore || false;
    const highscore = gameSession.highscore || false;
    const gameOver = gameSession.gameOver || false;
    const gameStartTime = gameSession.gameStartTime
    const existingGame = gameSession.existingGame
    

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
    console.log("Start game");
    console.log("Setting req", gameSession);
    gameSession.existingGame = true;
    gameSession.foundCharacters = [];
    const foundCharacters =gameSession.foundCharacters;
    const gameCharacters = randomCharacters(gameId);
    gameSession.gameCharacters = gameCharacters;
    console.log(gameCharacters);
    const gameStartTime = Date.now();
    gameSession.gameStartTime = gameStartTime;

    res
      .status(201)
      .json({ gameCharacters, foundCharacters, message: "Game started", newGame: true, gameStartTime });
  }
};


export { checkPosition, startGame, storeUsername };
