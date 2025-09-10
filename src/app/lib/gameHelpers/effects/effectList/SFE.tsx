import Card from "@/app/models/card";
import { GameState } from "@/app/models/gameState";
import { updateFP } from "../../player";

export function SFE(gameState: GameState, cardId: string, targets?: Card[]) {
  
  if (targets && targets.length > 0) {
    const targetMonster = targets[0];
    for (let row = 0; row < gameState.field.slots.length; row++) {
      for (let col = 0; col < gameState.field.slots[row].length; col++) {
        const slot = gameState.field.slots[row][col];
        if (slot.card && slot.card.id === targetMonster.id) {
          gameState.discardPile.addCards([slot.card]);
          slot.card = null;
          break;
        }
      }
    }
  }
  updateFP(gameState, gameState.currentTurn, 4);
  return gameState;
}

SFE.requiresTarget = true;
SFE.targetRequirements = {
  type: "MONSTER",
  count: 1,
  location: "field",
  owner: "any" 
};
