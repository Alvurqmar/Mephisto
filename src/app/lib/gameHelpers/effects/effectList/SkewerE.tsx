import { GameState } from "@/app/models/gameState";
import { cardPos } from "../../field";
import { CardType } from "@/app/models/card";
import { findById } from "../../card";

export function SkewerE(gameState: GameState, cardId: string) {
  const numericCardId = parseInt(cardId);
  const position = cardPos(gameState.field, numericCardId);
  const card = findById(gameState, numericCardId);
  const playerId = card?.owner; 
  
  if (!position || !card || !playerId) {
    console.warn("Skewer card not found on field");
    return gameState;
  }
  let monstersLane = 0;
  const orientation = gameState.players[playerId].orientation;
  const { row, col } = position;

  if (orientation === 'horizontal') {
    for (let col = 0; col < gameState.field.slots[row].length; col++) {
      const slot = gameState.field.slots[row][col];
      if (slot.card && slot.card.type === CardType.MONSTER) {
        monstersLane += 1;
      }
    }
  } else {
    for (let row = 0; row < gameState.field.slots.length; row++) {
      const slot = gameState.field.slots[row][col];
      
      if (slot.card && slot.card.type === CardType.MONSTER ) {
        monstersLane += 1;
      }
    }
  }

  if (monstersLane >= 2) {
    card.attack += 2;
    card.temporal = true
  }
  
  return gameState;
}

SkewerE.requiresTarget = false;