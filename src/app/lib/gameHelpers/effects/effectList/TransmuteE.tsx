import { GameState } from "@/app/models/gameState";
import { durabilityChange, findById } from "../../card";
import Card from "@/app/models/card";
import phaseStore from "@/app/stores/phaseStore";


export function TransmuteE(gameState: GameState, cardId: string, targets?: Card[]) {
  if (!targets || targets.length < 2) {
    console.warn("Transmute requires 2 targets.");
    return gameState;
  }
  const targetOppData = targets[0];
  const targetOwnData = targets[1];
  const targetOppCard = findById(gameState, targetOppData.id);
  const targetOwnCard = findById(gameState, targetOwnData.id);


  if (!targetOppCard || !targetOwnCard) {
    console.warn("One or more target cards not found in game state.");
    return gameState;
  }
  
  durabilityChange(gameState, targetOppCard, -1);
  targetOwnCard.attack += 5;
  targetOwnCard.temporal = true;

  return gameState;
}

TransmuteE.requiresTarget = true;
TransmuteE.targetRequirements = [
    {
  type: ["WEAPON, ITEM"],
  count: 1,
  location: "field",
  owner: "opponent",
},
{
  type: "WEAPON",
  count: 1,
  location: "field",
  owner: phaseStore.currentTurn,
    },
];