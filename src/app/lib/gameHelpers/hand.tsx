import Card from "@/app/models/card";
import { GameState } from "@/app/models/gameState";
import Hand from "@/app/models/hand";

export function findByIdInHand(gameState: GameState, cardId: number, playerId: string): Card | null {
  const hand = gameState.hands[playerId];
  const card = hand.find(c => c.id === cardId);
  return card || null;
}

export function removeCardFromHand(gameState: GameState, cardId: number, playerId: string) {
  const hand = gameState.hands[playerId];
  const cardIndex = hand.findIndex(card => card.id === cardId);
  if (cardIndex !== -1) {
    hand.splice(cardIndex, 1);
  }
}

export function filterHandType(hand: Hand, type: string) {
  const handCards = hand.cards;
  return handCards.filter((card) => card.type === type);
}