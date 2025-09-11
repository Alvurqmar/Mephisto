import { GameState } from "@/app/models/gameState";
import { activatedAbility, findById } from "../../card";
import Card from "@/app/models/card";
import { topCard } from "../../deck";
import { updateFP } from "../../player";
import { cardPos } from "../../field";


export function TorchE(gameState: GameState, cardId: string, targets?: Card[]) {
  const numericCardId = parseInt(cardId);
  const effectCard = findById(gameState, numericCardId);
  const player = effectCard?.owner;

  if (!targets || targets.length === 0) {
    console.warn("No targets provided for Torch.");
    return gameState;
  }
  
  const targetCard = targets[0];
  const targetSlot = cardPos(gameState.field, targetCard.id);
if (targetSlot !== null) {
  const slot = gameState.field.getSlot(targetSlot.row, targetSlot.col);
  gameState.discardPile.addCards([targetCard]);


  if (!targetSlot) {
    console.warn("Target card not found on field.");
    return gameState;
  }
  
  const newCard = topCard(gameState);
    slot!.card = newCard;
  
  updateFP(gameState, player!, 2);
}
  activatedAbility(gameState, numericCardId);
  return gameState;
}

TorchE.requiresTarget = true;
TorchE.targetRequirements = {
  type: ["ITEM", "WEAPON", "SPELL"],
  count: 1,
  location: "lane",
  owner: "any",
};