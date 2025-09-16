import { GameState } from "@/app/models/gameState";
import { drawCard } from "../../deck";
import Card from "@/app/models/card";

export function SpiderE(gameState: GameState) {
  for (const playerId in gameState.players) {
    if (Object.prototype.hasOwnProperty.call(gameState.players, playerId)) {
      const hand = gameState.hands[playerId];
      if (hand.length > 0) {
        const randomIndex = Math.floor(Math.random() * hand.length);
        const discardedCard: Card[] = hand.splice(randomIndex, 1);
        gameState.discardPile.addCards(discardedCard);
      }
      
      drawCard(gameState, playerId);
    }
  }

  return gameState;
}

SpiderE.requiresTarget = false;