import { GameState } from "@/app/models/gameState";
import { activatedAbility, findById } from "../../card";
import Card from "@/app/models/card";
import { cardPos } from "../../field";


export function HookshotE(gameState: GameState, cardId: string, targets?: Card[]) {
  const numericCardId = parseInt(cardId);
  const card = findById(gameState, numericCardId);
  const player = card?.owner;
  if (targets && targets.length > 0 && card && player) {

  const targetCard = targets[0];
    const targetSlot = cardPos(gameState.field, targetCard.id);
  
  if ((targetCard.type !== "ITEM" && targetCard.type !== "WEAPON"&& targetCard.type !== "MONSTER")) {
    console.warn("Invalid target for Hookshot - must be a non-spell");
    return gameState;
  }
  if (targetSlot !== null) {
  const slot = gameState.field.getSlot(targetSlot.row, targetSlot.col);
  slot!.card = null;
  }

  gameState.hands[player].push(targetCard);
  targetCard.owner = player;

  activatedAbility(gameState, numericCardId);


}
  return gameState;
}

HookshotE.requiresTarget = true;
HookshotE.targetRequirements = {
  type: ["ITEM", "WEAPON", "MONSTER"],
  count: 1,
  location: "field",
  owner: "any"
};