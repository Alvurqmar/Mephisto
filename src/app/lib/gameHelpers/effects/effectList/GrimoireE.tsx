import Card, { CardType } from "@/app/models/card";
import { GameState } from "@/app/models/gameState";
import { cardPos } from "../../field";
import { activatedAbility, findById } from "../../card";

export function GrimoireE(gameState: GameState, cardId: string, targets?: Card[]) {
const numericCardId = parseInt(cardId);
  if (!targets || targets.length === 0) {
    console.warn("No targets provided for Grimoire.");
    return gameState;
  }

  const target = targets[0];
  const targetCard = findById(gameState, target.id);

  if (!targetCard || targetCard.type !== CardType.SPELL || targetCard.cost > 0) {
    console.warn("Invalid target for Grimoire - must be a spell with cost 0");
    return gameState;
  }
  targetCard.owner = gameState.currentTurn;
  const targetCardPos = cardPos(gameState.field, targetCard.id);
  if (!targetCardPos) {
    console.warn("Field card position not found.");
    return gameState;
  }

  const { row: Row, col: Col } = targetCardPos;
  const slot = gameState.field.slots[Row][Col];

  slot.card = null;
  gameState.hands[targetCard.owner].push(targetCard);

  activatedAbility(gameState, numericCardId);

  return gameState;
}

GrimoireE.requiresTarget = true;
GrimoireE.targetRequirements = {
  type: "SPELL",
  count: 1,
  location: "field",
  owner: "any",
};
