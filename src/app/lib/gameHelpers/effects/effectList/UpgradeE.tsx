import { GameState } from "@/app/models/gameState";
import { durabilityChange, findById } from "../../card";
import Card from "@/app/models/card";


export function UpgradeE(gameState: GameState, cardId: string, targets?: Card[]) {
    if (!targets || targets.length === 0) {
    console.warn("No targets provided for Upgrade.");
    return gameState;
  }
  const targetData = targets[0];
  const targetCard = findById(gameState, targetData.id);

  if (!targetCard || (targetCard.type !== "WEAPON")) {
    console.warn("Invalid target for Upgrade - must be a weapon");
    return gameState;
  }
  
  targetCard.attack += 3;
  durabilityChange(gameState, targetCard, 1);

  return gameState;
}

UpgradeE.requiresTarget = true;
UpgradeE.targetRequirements = {
  type: "WEAPON",
  count: 1,
  location: "field",
  owner: "own",
};