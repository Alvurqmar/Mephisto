'use client';

import { useEffect, useState } from 'react';

interface Card {
  id: number;
  name: string;
  type: string;
  cost: number;
  attack: number;
  durability: number;
  effect: string;
  soulpts: number;
}
function renderCard(card: Card) {
  return (
    <img
      src={`/cards/${card.name}.png`}
      alt={card.name}
        width={150}
        height={200}
        className="rounded-lg"
    />
  );
}
export default function Board() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [fieldCards, setFieldCards] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]);

  useEffect(() => {
    async function fetchCards() {
      const res = await fetch('/api/cards');
      const data = await res.json();
      const shuffled = shuffleArray(data);

      setDeck(shuffled);

      setFieldCards(shuffled.slice(0, 6));
      setPlayerHand(shuffled.slice(6, 9));
      setOpponentHand(shuffled.slice(9, 13));
    }

    fetchCards();
  }, []);

  function shuffleArray(array: Card[]) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  return (
    <div className="flex flex-col h-screen bg-grey overflow-hidden">
      {/* Opponent Hand */}
      <div className="flex justify-center space-x-2 p-2 flex-none rotate-180">
        {opponentHand.map((_, index) => (
          <img
            key={index}
            src="/cards/CardBack.png"
            alt="Hidden Card"
            width={100}
            height={150}
            className="rounded-lg"
          />
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 flex-grow p-4">
        
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/cards/Favor.png"
            alt="Favor Tracker"
            width={150}
            height={200}
            className="rounded-lg transform rotate-180"
          />
          <img
            src="/cards/CardBack.png"
            alt="Card Back"
            width={150}
            height={200}
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col items-center space-y-4">
          {fieldCards[0] && renderCard(fieldCards[0])}
          {fieldCards[1] && renderCard(fieldCards[1])}
        </div>

        <div className="flex flex-col items-center space-y-4">
          {fieldCards[2] && renderCard(fieldCards[2])}
          {fieldCards[3] && renderCard(fieldCards[3])}
        </div>

        <div className="flex flex-col items-center space-y-4">
          {fieldCards[4] && renderCard(fieldCards[4])}
          {fieldCards[5] && renderCard(fieldCards[5])}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-35 h-50 bg-transparent border flex items-center justify-center rounded rotate-90">
            Discard Pile
          </div>
          <img
            src="/cards/Favor.png"
            alt="Favor Tracker"
            width={150}
            height={200}
            className="rounded-lg transform"
          />
        </div>

      </div>

      <div className="flex justify-center space-x-2 p-2 flex-none">
        {playerHand.map((card, index) => (
          <img
            key={index}
            src={`/cards/${card.name}.png`}
            alt={card.name}
            width={100}
            height={150}
            className="rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}


