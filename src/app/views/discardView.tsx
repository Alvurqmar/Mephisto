'use client';
import React from "react";
import { observer } from "mobx-react";
import cardActions from "../stores/actions/cardActions";
import handStore from "../stores/handStore";
import phaseStore from "../stores/phaseStore";
import Image from "next/image";

type DiscardProps = {
  gameId: string;
};
const DiscardView = observer(({ gameId }: DiscardProps) => {
  const slot = cardActions.pendingSlot;

  if (!cardActions.discardModal || !slot) return null;

  const hand = handStore.hands[phaseStore.currentTurn];
  const cost = cardActions.selectedCard?.cost ?? 0;

  const toggleCard = (cardId: number) => {
    const card = hand.cards.find((c) => c.id === cardId);
    if (card) cardActions.toggleDiscardCard(card);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="bg-neutral-700 p-6 rounded max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">
          Selecciona {cost} carta{cost > 1 ? "s" : ""} para descartar
        </h2>

        <div className="flex gap-2 overflow-x-auto mb-6">
          {hand.cards
            .filter((c) => c.id !== cardActions.selectedCard?.id)
            .map((card) => {
              const isSelected = cardActions.discardSelection.some(
                (c) => c.id === card.id
              );
              return (
                <Image
                  key={card.id}
                  src={`/cards/${card.name}.png`}
                  alt={card.name}
                  width={80} 
                  height={112}
                  className={`rounded cursor-pointer border-4 transition ${
                    isSelected ? "border-red-600" : "border-transparent"
                  }`}
                  onClick={() => toggleCard(card.id)}
                />
              );
            })}
        </div>

        <div className="flex justify-between">
          <button
            onClick={cardActions.cancelDiscard}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            disabled={cardActions.discardSelection.length !== cost}
            onClick={() => cardActions.confirmDiscard(gameId)}
            className={`px-4 py-2 rounded text-white transition ${
              cardActions.discardSelection.length === cost
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
});

export default DiscardView;
