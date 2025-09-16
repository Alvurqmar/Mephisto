import { GameState } from "@/app/models/gameState";
import { updateFP } from "../../player";
import { activatedAbility, durabilityChange, findById } from "../../card";
import { restartDeck } from "../../deck";

export function MPE(gameState: GameState, cardId: string) {
  const numericCardId = parseInt(cardId);
  let topCard = gameState.deck.shift();
  if (!topCard) {
    restartDeck(gameState);
    topCard = gameState.deck.shift();
  }
  gameState.deck.push(topCard!);

  switch (topCard!.type) {
    case "MONSTER":
      updateFP(gameState, gameState.currentTurn, 3);
      break;
    case "SPELL":
      gameState.hands[gameState.currentTurn].push(topCard!);
      break;
    case "WEAPON":
    case "ITEM":
      const card = findById(gameState, numericCardId);
      if (card && card.durability !== undefined) {
        durabilityChange(gameState,card, 1);
      }
      break;
  }
  activatedAbility(gameState, numericCardId);

  return gameState;
}
MPE.requiresTarget = false;
