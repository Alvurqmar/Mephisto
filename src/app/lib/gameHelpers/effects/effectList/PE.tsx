import { GameState } from "@/app/models/gameState";
import { updateFP } from "../../player";
import { activatedAbility, findById } from "../../card";
import { cardPos } from "../../field";

export function PE(gameState: GameState, cardId: string) {
  const numericCardId = parseInt(cardId);
  const position = cardPos(gameState.field, numericCardId);
  const card = findById(gameState, numericCardId);
  const PlayerId = card?.owner;
  const orientation = gameState.players[PlayerId!].orientation;

  if (!position || !card) {
    console.warn("Potion card not found on field");
    return gameState;
  }

  const { row: Row, col: Col } = position;

  let bonusFP = 0;

  if (orientation === "horizontal") {
    for (let col = 0; col < gameState.field.slots[Row].length; col++) {
      const slot = gameState.field.slots[Row][col];
      if (
        slot.card &&
        slot.card.type !== "MONSTER" &&
        slot.card.id !== numericCardId
      ) {
        bonusFP += 1;
      }
    }
  } else {
    for (let row = 0; row < gameState.field.slots.length; row++) {
      const slot = gameState.field.slots[row][Col];
      if (
        slot.card &&
        slot.card.type !== "MONSTER" &&
        slot.card.id !== numericCardId
      ) {
        bonusFP += 1;
      }
    }
  }

  const totalFPGain = 1 + bonusFP;

  updateFP(gameState, card.owner!, totalFPGain);

  activatedAbility(gameState, numericCardId);

  return gameState;
}

PE.requiresTarget = false;
