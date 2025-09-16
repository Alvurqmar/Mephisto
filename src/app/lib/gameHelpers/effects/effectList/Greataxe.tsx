import { GameState } from "@/app/models/gameState";
import { durabilityChange, findById } from "../../card";
import Card from "@/app/models/card";

export function GreataxeE(gameState: GameState, cardId: string, targets?: Card[]) {

  if (!targets || targets.length === 0) {
    console.warn("No targets provided for GreatAxe.");
    return gameState;
  }

  const targetData = targets[0];
  const targetCard = findById(gameState, targetData.id);
    
  durabilityChange(gameState, targetCard!, -1);
  
  return gameState;
}

GreataxeE.requiresTarget = true;
GreataxeE.targetRequirements = {
  type: ["ITEM", "WEAPON"],
  count: 1,
  location: "lane",
  owner: "opponent",
};