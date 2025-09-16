import { GameState } from "@/app/models/gameState";
import { activatedAbility, findById } from "../../card";
import Card from "@/app/models/card";
import { updateFP } from "../../player";
import { cardPos } from "../../field";

export function TCE(gameState: GameState, cardId: string, targets?: Card[]) {
  const numericCardId = parseInt(cardId);
  const effectCard = findById(gameState, numericCardId);
  const player = effectCard?.owner;

  if (!player || gameState.players[player].favorPoints < 1) {
      console.warn("Not enough FP.");
    return gameState; 
  }
  updateFP(gameState, player!, -1);

  if (!targets || targets.length === 0) {
    console.warn("No targets provided for Treasure Chest.");
    return gameState;
  }

  const targetCard = targets[0];
  const targetSlot = cardPos(gameState.field, targetCard.id);

  if (targetSlot !== null) {
    const slot = gameState.field.getSlot(targetSlot.row, targetSlot.col);
    
    targetCard.owner = player;
    gameState.hands[player!].push(targetCard);
    
    slot!.card = null;
    
  } else {
    console.warn("Target card not found on field.");
    return gameState;
  }
  
  activatedAbility(gameState, numericCardId);
  
  return gameState;
}

TCE.requiresTarget = true;
TCE.targetRequirements = {
  type: ["ITEM", "WEAPON", "SPELL"],
  count: 1,
  location: "lane",
  owner: "any",
};