import { GameState } from "@/app/models/gameState";
import { findById } from "../../card";
import { findByIdInHand, removeCardFromHand } from "../../hand";
import Card from "@/app/models/card";

export function ArcanifeE(gameState: GameState, cardId: string, targets?: Card[]) {
  const numericCardId = parseInt(cardId);
  const card = findById(gameState, numericCardId);
  const playerId = card?.owner;

if (!targets || targets.length === 0) {
    console.warn("No targets provided for Arcanife");
    return gameState;
  } 
  const handCard = findByIdInHand(gameState, targets[0].id, targets[0].owner!);

  if (!handCard) {
    console.warn("Target card not found in game state.");
    return gameState;
  }

    const handOwner = targets[0].owner!;

  if (!card || !playerId) {
    console.warn("Arcanife card not found on field");
    return gameState;
  }

  removeCardFromHand(gameState, handCard.id, handOwner!);
  gameState.discardPile.addCards([handCard]);
  
  card.attack += 3;
  card.temporal = true;
  return gameState;
}

ArcanifeE.requiresTarget = true;
ArcanifeE.targetRequirements = {
  type: ["SPELL"],
  count: 1,
  location: "hand",
  owner: "any",
};
