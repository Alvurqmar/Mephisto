import { GameState } from "@/app/models/gameState";
import { cardPos } from "../../field";
import { CardType } from "@/app/models/card";
import { findById } from "../../card";
import { updateFP } from "../../player";

export function ForkE(gameState: GameState, cardId: string) {
  const numericCardId = parseInt(cardId);
  const position = cardPos(gameState.field, numericCardId);
  const card = findById(gameState, numericCardId);
  const playerId = card?.owner; 
  
  if (!position || !card || !playerId) {
    console.warn("Fork card not found on field or owner missing.");
    return gameState;
  }
  
  const orientation = gameState.players[playerId].orientation;
  const { row, col } = position;
  
  let opponentOwnerId: string | undefined;

  if (orientation === 'horizontal') {
    for (let col = 0; col < gameState.field.slots[row].length; col++) {
      const slot = gameState.field.slots[row][col];
      
      if (slot.card && (slot.card.type === CardType.ITEM || slot.card.type === CardType.WEAPON) && slot.card.owner && slot.card.owner !== playerId) {
        opponentOwnerId = slot.card.owner;
        break;
      }
    }
  } else {
    for (let row = 0; row < gameState.field.slots.length; row++) {
      const slot = gameState.field.slots[row][col];
      
      if (slot.card && (slot.card.type === CardType.ITEM || slot.card.type === CardType.WEAPON) && slot.card.owner && slot.card.owner !== playerId) {
        opponentOwnerId = slot.card.owner;
        break;
      }
    }
  }

  if (opponentOwnerId) {
    updateFP(gameState, opponentOwnerId, -2);
  }

  return gameState;
}

ForkE.requiresTarget = false;