import { GameState } from "@/app/models/gameState";
import { findById } from "../../card";
import Card from "@/app/models/card";
import phaseStore from "@/app/stores/phaseStore";


export function UpgradeE(gameState: GameState, cardId: string, targets?: Card[]) {
  const numericCardId = parseInt(cardId);
  const card = findById(gameState, numericCardId);
  const player = card?.owner;
  if (targets && targets.length > 0 && card && player) {

  const targetData= targets[0];
    const targetCard = findById(gameState, targetData.id);
  
  if (!targetCard || targetCard.type !== "WEAPON") {
    console.warn("Invalid target for Upgrade - must be a weapon");
    return gameState;
  }

  targetCard.attack += 3;
  targetCard.durability += 1;


}
  return gameState;
}

UpgradeE.requiresTarget = true;
UpgradeE.targetRequirements = {
  type: "WEAPON",
  count: 1,
  location: "field",
  owner: phaseStore.currentTurn,
};