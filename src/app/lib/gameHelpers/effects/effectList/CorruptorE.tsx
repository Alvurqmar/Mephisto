import { GameState } from "@/app/models/gameState";
import { cardPos } from "../../field";
import { CardType } from "@/app/models/card";
import { durabilityChange, findById } from "../../card";

export function CorruptorE(gameState: GameState, cardId: string) {
  const numericCardId = parseInt(cardId);
  const position = cardPos(gameState.field, numericCardId);
  const card = findById(gameState, numericCardId);
  const PlayerId = card?.owner; 
  const orientation = gameState.players[PlayerId!].orientation;

  if (!position || !card) {
    console.warn("Corruptor card not found on field");
    return gameState;
  }

  const { row: Row, col: Col } = position;


  if (orientation === 'horizontal') {
    for (let col = 0; col < gameState.field.slots[Row].length; col++) {
      const slot = gameState.field.slots[Row][col];
      if (slot.card && (slot.card.type === CardType.ITEM || slot.card.type === CardType.WEAPON) && slot.card.id !== numericCardId) {
        durabilityChange(gameState, slot.card, -1);
      }
    }
  } else {
    for (let row = 0; row < gameState.field.slots.length; row++) {
      const slot = gameState.field.slots[row][Col];
      if (slot.card && (slot.card.type === CardType.ITEM || slot.card.type === CardType.WEAPON) && slot.card.id !== numericCardId) {
        durabilityChange(gameState, slot.card, -1);
      }
    }
  }

  return gameState;
}

CorruptorE.requiresTarget = false;