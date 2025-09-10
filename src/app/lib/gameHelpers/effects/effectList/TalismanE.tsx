import { GameState } from "@/app/models/gameState";
import { activatedAbility, findById } from "../../card";
import Card from "@/app/models/card";
import { fetchCardEffect } from "../cardEffect";
import phaseStore from "@/app/stores/phaseStore";

export function TalismanE(gameState: GameState, cardId: string, targets?: Card[]) {
  const numericCardId = parseInt(cardId);
  const talismanCard = findById(gameState, numericCardId);
  if (targets && targets.length > 0 && talismanCard) {

  const targetCard = targets[0];
  
  if ((targetCard.type !== "ITEM" && targetCard.type !== "WEAPON") || 
      !targetCard.effectId || 
      targetCard.effectType !== "AA") {
    console.warn("Invalid target for Talisman - must be Item or Weapon with activated ability");
    return gameState;
  }

  fetchCardEffect(phaseStore.currentTurn, targetCard.effectId, cardId, gameState.id, )

  activatedAbility(gameState, numericCardId);


}
  return gameState;
}

TalismanE.requiresTarget = true;
TalismanE.targetRequirements = {
  type: ["ITEM", "WEAPON"],
  count: 1,
  location: "field",
  owner: "any"
};