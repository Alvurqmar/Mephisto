import Card from "@/app/models/card";
import { GameState } from "@/app/models/gameState";
import { findOriginalCardData } from "../cardBase";
import phaseStore from "@/app/stores/phaseStore";
import { checkPassiveEffects } from "./effects/passiveEffect";

export function findById(gameState: GameState, cardId: number) {
  for (let row = 0; row < gameState.field.slots.length; row++) {
    for (let col = 0; col < gameState.field.slots[row].length; col++) {
      const slot = gameState.field.slots[row][col];
      if (slot.card && slot.card.id === cardId) {
        return slot.card;
      }
    }
  }
}

export function activatedAbility(gameState: GameState, cardId: number) {
  const card = findById(gameState, cardId);
  if (card && card.durability !== undefined) {
    card.isTapped = true;
    const history = gameState.players[card.owner!].activationHistory;
    if(history[cardId]){
      history[cardId] += 1;
    } else {
      history[cardId] = 1;
    }
    checkPassiveEffects([card], gameState.players, card.owner!, false, gameState);
    durabilityChange(gameState, card, -1);
    }
}

export function durabilityChange(gameState: GameState, card: Card, amount: number){
   if (card && card.durability !== undefined) {
  card!.durability += amount;
        if(card.durability <= 0){
        for (let row = 0; row < gameState.field.slots.length; row++) {
        for (let col = 0; col < gameState.field.slots[row].length; col++) {
          const slot = gameState.field.slots[row][col];
          if (slot.card && slot.card.id === card.id) {
            slot.card = null;
            gameState.discardPile.addCards([card]);
          }
        }
      }
      }
}
}

export function filterCardOwner(cards: Card[], playerId: string): Card[] {
  return cards.filter(card => card.owner === playerId);
}

export function resetCard(card: Card){
  const originalData = findOriginalCardData(card.id);
  if (originalData) {
    card.attack = originalData.attack;
    card.durability = originalData.durability;
    card.isTapped = false;
    card.owner = null;
  }
}

 export async function updateCard(gameId: string, cardId: number, updates: { attack: number }) {
    try {
      await fetch(`/api/games/${gameId}/actions/updateCard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: phaseStore.currentTurn,
          cardId,
          updates,
        }),
      });
    } catch (error) {
      console.error("Failed to update card on server:", error);
    }
  }