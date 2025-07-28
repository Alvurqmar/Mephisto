import React from "react";
import { observer } from "mobx-react";
import gameActions from "../stores/gameActions";
import gameStore from "../stores/gameStore";

const DiscardView = observer(() => {
  const slot = gameActions.pendingSlot;

  if (!gameActions.discardModal || !slot) return null;

  const hand = gameStore.hands[gameStore.currentTurn];
  const cost = gameActions.selectedCard?.cost ?? 0;

  const toggleCard = (cardId: number) => {
    const card = hand.cards.find((c) => c.id === cardId);
    if (card) {
      gameActions.toggleDiscardCard(card);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="bg-neutral-700 p-6 rounded max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">
          Selecciona {cost} cartas para descartar
        </h2>

        <div className="flex gap-2 overflow-x-auto mb-6">
          {hand.cards
            .filter((c) => c.id !== gameActions.selectedCard?.id)
            .map((card) => {
              const isSelected = gameActions.discardSelection.some(
                (c) => c.id === card.id
              );
              return (
                <img
                  key={card.id}
                  src={`/cards/${card.name}.png`}
                  alt={card.name}
                  className={`w-20 h-28 rounded cursor-pointer border-4 transition ${
                    isSelected ? "border-red-600" : "border-transparent"
                  }`}
                  onClick={() => toggleCard(card.id)}
                />
              );
            })}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              gameActions.cancelDiscard();
            }}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            disabled={gameActions.discardSelection.length !== cost}
            onClick={() => {
              gameActions.confirmDiscard(slot.row, slot.col);
            }}
            className={`px-4 py-2 rounded text-white transition ${
              gameActions.discardSelection.length === cost
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
