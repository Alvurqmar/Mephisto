import Card from "@/app/models/card";
import DiscardPile from "@/app/models/discardPile";
import { GameState } from "@/app/models/gameState";

export function drawCard(gameState: GameState, playerId: string) {
  if (gameState.deck.length === 0) {
    restartDeck(gameState);
  }

  const card = gameState.deck.shift();
  if (!card) return null;

  gameState.hands[playerId].push(card);
  return card;
}

export function topCard(gameState: GameState){
    if (gameState.deck.length === 0) {
    restartDeck(gameState);
  }
    const card = gameState.deck.shift();
    return card!;
}

export function restartDeck(gameState: GameState) {
  const discarded = gameState.discardPile.cards;
  clearDiscardPile(gameState.discardPile);
  const shuffled = shuffle(discarded);

  gameState.deck = shuffled;
}

function clearDiscardPile(pile: DiscardPile) {
  pile.cards = [];
}

export function shuffle(array: Card[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

