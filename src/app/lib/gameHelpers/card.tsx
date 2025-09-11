import Card from "@/app/models/card";
import { GameState } from "@/app/models/gameState";

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
