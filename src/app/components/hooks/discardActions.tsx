import { useState } from "react";
import Card from "../card";

interface UseDiscardProps {
  hand: Card[];
  onDiscardComplete: (discardedCards: Card[]) => void;
}

export function useDiscard({ hand, onDiscardComplete }: UseDiscardProps) {
  const [Discarding, setDiscarding] = useState(false);
  const [requiredCards, setRequiredCards] = useState(0);
  const [cardsToDiscard, setCardsToDiscard] = useState<Card[]>([]);

  function startDiscard(cardCost: number) {
    setDiscarding(true);
    setRequiredCards(cardCost);
    setCardsToDiscard([]);
  }

  function toggleCardToDiscard(card: Card) {
    setCardsToDiscard((prev) =>
      prev.some((c) => c.id === card.id)
        ? prev.filter((c) => c.id !== card.id)
        : [...prev, card]
    );
  }

  function confirmDiscard() {
    if (cardsToDiscard.length !== requiredCards) return;

    onDiscardComplete(cardsToDiscard);
    resetDiscard();
  }

  function resetDiscard() {
    setDiscarding(false);
    setCardsToDiscard([]);
    setRequiredCards(0);
  }

  return {
    Discarding,
    requiredCards,
    cardsToDiscard,
    startDiscard,
    toggleCardToDiscard,
    confirmDiscard,
    resetDiscard,
  };
}
