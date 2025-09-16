import { GameState } from "@/app/models/gameState";
import { findById } from "../../card";
import Card from "@/app/models/card";


export function BlazingE(gameState: GameState, cardId: string, targets?: Card[]) {
  if (!targets || targets.length === 0) {
    console.warn("No targets provided for Blazing.");
    return gameState;
  }
  const targetData = targets[0];
  const targetCard = findById(gameState, targetData.id);

  if (!targetCard || (targetCard.type !== "WEAPON")) {
    console.warn("Invalid target for Blazing - must be a weapon");
    return gameState;
  }
  
  targetCard.attack += 3;

  return gameState;
}

BlazingE.requiresTarget = true;
BlazingE.targetRequirements = {
  type: "WEAPON",
  count: 1,
  location: "field",
  owner: "own",
};