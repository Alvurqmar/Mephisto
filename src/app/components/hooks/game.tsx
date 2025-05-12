import { useEffect, useState } from "react";
import Card from "../card";

export function Game() {
  // Estados
  const [deck, setDeck] = useState<Card[]>([]);
  const [fieldCards, setFieldCards] = useState<Card[]>([]);
  const [playerFields, setPlayerFields] = useState<{
    [playerId: string]: (Card | null)[][];
  }>({
    player1: [
      [null, null],
      [null, null],
      [null, null],
    ],
    player2: [
      [null, null],
      [null, null],
      [null, null],
    ],
  });
  const [hands, setHands] = useState<{ [playerId: string]: Card[] }>({});
  const [currentTurn, setCurrentTurn] = useState<"player1" | "player2">(
    "player1"
  );
  const [currentPhase, setCurrentPhase] = useState<
    "Fase Inicial" | "Fase de Acción" | "Fase Final"
  >("Fase Inicial");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [cardsToDiscard, setCardsToDiscard] = useState<Card[]>([]);
  const [requiredDiscardCount, setRequiredDiscardCount] = useState<number>(1);

  // Funciones
  useEffect(() => {
    async function fetchCards() {
      const res = await fetch("/api/cards");
      const data = await res.json();
      const shuffled = shuffleArray(data);

      setDeck(shuffled);
      setFieldCards(shuffled.slice(0, 6));
      setHands({
        player1: shuffled.slice(6, 9),
        player2: shuffled.slice(9, 13),
      });
    }

    fetchCards();
  }, []);

  const shuffleArray = (array: Card[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const changeTurn = () => {
    setCurrentTurn((prevTurn) =>
      prevTurn === "player1" ? "player2" : "player1"
    );
  };

  const changePhase = () => {
    if (currentPhase === "Fase Inicial") {
      setCurrentPhase("Fase de Acción");
    } else if (currentPhase === "Fase de Acción") {
      setCurrentPhase("Fase Final");
    } else {
      setCurrentPhase("Fase Inicial");
      changeTurn();
    }
  };

  const playCard = (
    playerId: string,
    card: Card,
    lane: number,
    slot: number
  ) => {
    const newHand = hands[playerId].filter((c) => c.id !== card.id);
    setHands((prev) => ({
      ...prev,
      [playerId]: newHand,
    }));
    const updatedField = [...playerFields[playerId]];
    updatedField[lane] = [...updatedField[lane]];
    updatedField[lane][slot] = card;

    setPlayerFields((prev) => ({
      ...prev,
      [playerId]: updatedField,
    }));
  };

  const startDiscard = (card: Card) => {
    setIsDiscarding(true);
    setSelectedCard(card);
    setRequiredDiscardCount(card.cost);
  };

  const toggleCardToDiscard = (card: Card) => {
    setCardsToDiscard((prev) =>
      prev.some((c) => c.id === card.id)
        ? prev.filter((c) => c.id !== card.id)
        : [...prev, card]
    );
  };

  const confirmDiscard = () => {
    if (cardsToDiscard.length === requiredDiscardCount) {
      setHands((prev) => ({
        ...prev,
        [currentTurn]: prev[currentTurn].filter(
          (card) => !cardsToDiscard.some((c) => c.id === card.id)
        ),
      }));

      setIsDiscarding(false);
      setCardsToDiscard([]);
      setRequiredDiscardCount(1);
      setSelectedCard(null);
    } else {
      alert(
        `Selecciona exactamente ${requiredDiscardCount} carta(s) para descartar.`
      );
    }
  };

  return {
    deck,
    setDeck,
    fieldCards,
    setFieldCards,
    hands,
    setHands,
    playerFields,
    setPlayerFields,
    currentTurn,
    currentPhase,
    changeTurn,
    changePhase,
    playCard,
    isDiscarding,
    setIsDiscarding,
    setCardsToDiscard,
    cardsToDiscard,
    selectedCard,
    setSelectedCard,
    startDiscard,
    toggleCardToDiscard,
    confirmDiscard,
  };
}
