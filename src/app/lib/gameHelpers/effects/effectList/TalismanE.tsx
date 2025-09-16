import { GameState } from "@/app/models/gameState";
import { activatedAbility, findById } from "../../card";
import Card from "@/app/models/card";
import { cardEffect } from "../cardEffect";

export async function TalismanE(gameState: GameState, cardId: string, targets?: Card[]) {
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

    talismanCard.effectId = targetCard.effectId;
    talismanCard.temporal = true;
    
    const updatedState = cardEffect(gameState, talismanCard.effectId, talismanCard.id.toString(), []);

    activatedAbility(updatedState, numericCardId);
    return updatedState;
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