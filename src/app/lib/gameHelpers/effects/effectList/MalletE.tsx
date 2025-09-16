import { GameState } from "@/app/models/gameState";
import { durabilityChange, findById } from "../../card";
import Card from "@/app/models/card";

export function MalletE(gameState: GameState, cardId: string, targets?: Card[]) {

  if (!targets || targets.length === 0) {
    console.warn("No targets provided for Mallet.");
    return gameState;
  }
  const targetData = targets[0];
  const targetCard = findById(gameState, targetData.id);
  durabilityChange(gameState, targetCard!, 1);

  return gameState;
}

MalletE.requiresTarget = true;
MalletE.targetRequirements = {
  type: ["ITEM", "WEAPON"],
  count: 1,
  location: "lane",
  owner: "any",
};