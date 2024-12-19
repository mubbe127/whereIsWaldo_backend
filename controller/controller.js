import { json } from "express";
import characters from "../utils/characters";

const checkPosition = async (req, res) => {
  const { position, characterId } = req.body;
  let foundCharacter;

  characters.forEach((character)=> {
    if (
        characterId === character.id &&
        position[1] < character.position.yBorder[1] &&
        position[1] > character.position.yBorder[0] &&
        position[0] < character.position.xBorder[1] &&
        position[0] > character.position.xBorder[0]
      ) {
        foundCharacter = character
        if(!req.session.foundCharacter.some(character=> character.id=== foundCharacter.id)) {
            req.session.foundCharacters.push(foundCharacter);
        } 
      } 
  })
  if (req.session.foundCharacters.length === 3) {
    let foundCharacters = req.session.foundCharacters;
    res.status(201).json({ foundCharacters, message: "You won the game" });
  } else if (foundCharacter) {
    res
      .status(201)
      .json({
        foundCharacter,
        message: `You found character with id: ${foundCharacter.id}`,
      });
  } else {
    res.status(201).json({ message: "No character found" });
  }
};

const startGame = async (req, res) => {

    function randomCharacters() {
        let array = [];
        Math.floor(Math.random() * 13);
    
        while (array.length < 3) {
          const randomNumber = Math.floor(Math.random() * 14);
          if (!array.includes(random)) {
            array.push(randomNumber);
          }
        }
      }

    if(req.session.existingGame) {
        const gameCharacterIds = req.sessions.gameCharacterIds
        const foundCharacters = req.session.foundCharacters

        res.status(201).json({gameCharacterIds, foundCharacters, message: "Existing game running"})
    }
    else {
        req.session.existingGame=true
        const gameCharacterIds = randomCharacters()
        req.session.gameCharacterIds=gameCharacterIds
        req.status(201).json({gameCharacterIds, message: "Game started"})
    }


     
}

export {checkPosition}
