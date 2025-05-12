"use client";

import { useState } from "react";
import { game } from "../components/hooks/game";
import Player from "../components/player";
import Card, { cardImg } from "../components/card";
import Hand from "../components/hand";

export default function Board() {
  const {
    deck,
    fieldCards,
    hands,
    playerFields,
    currentTurn,
    currentPhase,
    changePhase,
    playCard,
    cardsToDiscard,
    setCardsToDiscard,
    selectedCard,
    setSelectedCard,
    isDiscarding,
    startDiscard,
    toggleCardToDiscard,
    confirmDiscard,
  } = game();

  const [player1Favor, setPlayer1Favor] = useState(3);
  const [player2Favor, setPlayer2Favor] = useState(5);
  const [zoomCard, setZoomCard] = useState<Card | null>(null);
  const [playMessage, setPlayMessage] = useState<string | null>(null);
  const [zoomCardPosition, setZoomCardPosition] = useState<{
    playerId: "player1" | "player2";
    lane: number;
    slot: number;
  } | null>(null);

  return (
    <main className="flex flex-col h-screen overflow-hidden p-2 relative">
      <div className="grid grid-cols-5 gap-1 flex-grow items-center">
        {/*Zona info y Deck*/}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-[110px] h-[100px] border rounded bg-neutral-800 flex items-center justify-center">
            <Player
              user="user2"
              name="Jugador 2"
              favor={player2Favor}
              soulPoints={0}
            />
          </div>
          <img
            src="/cards/CardBack.png"
            alt="Dungeon Deck"
            className="w-[100px] h-[150px] rounded"
          />

          <p className="rounded bg-neutral-800">
            Turno: {currentTurn === "player1" ? "Jugador 1" : "Jugador 2"}
          </p>
          <button
            className="text-2xl border rounded bg-red-900 hover:bg-red-950 cursor-pointer transition transform active:scale-95"
            onClick={changePhase}
          >
            Fase Siguiente
          </button>
          <p className="rounded bg-neutral-800 ">Fase actual: {currentPhase}</p>

          <div className="w-[110px] h-[100px] border rounded bg-neutral-800 flex items-center justify-center">
            <Player
              user="user1"
              name="Jugador 1"
              favor={player1Favor}
              soulPoints={0}
            />
          </div>
        </div>
        {/*Zona de juego*/}
        {[0, 1, 2].map((laneIndex) => (
          <div key={laneIndex} className="flex flex-col items-center space-y-3">
            {playerFields.player2[laneIndex].map((card, idx) => (
              <div
                key={`p2-${laneIndex}-${idx}`}
                className={`w-[80px] h-[100px] border border-dashed rounded flex items-center justify-center${
                  !card && selectedCard
                    ? "hover:bg-green-800 cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (!card && selectedCard && currentTurn === "player2") {
                    playCard("player2", selectedCard, laneIndex, idx);
                    startDiscard(selectedCard);
                    setPlayMessage(null);
                  }
                }}
              >
                {card ? cardImg(card, () => setZoomCard(card)) : "Zona rival"}
              </div>
            ))}

            <div className="w-[80px] h-[100px]">
              {fieldCards[laneIndex * 2] &&
                cardImg(fieldCards[laneIndex * 2], () =>
                  setZoomCard(fieldCards[laneIndex * 2])
                )}
            </div>
            <div className="w-[80px] h-[100px]">
              {fieldCards[laneIndex * 2 + 1] &&
                cardImg(fieldCards[laneIndex * 2 + 1], () =>
                  setZoomCard(fieldCards[laneIndex * 2 + 1])
                )}
            </div>

            {playerFields.player1[laneIndex].map((card, idx) => (
              <div
                key={`p1-${laneIndex}-${idx}`}
                className={`w-[80px] h-[100px] border border-dashed rounded flex items-center justify-center${
                  !card && selectedCard
                    ? "hover:bg-green-800 cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (!card && selectedCard && currentTurn === "player1") {
                    playCard("player1", selectedCard, laneIndex, idx);
                    startDiscard(selectedCard);
                    setPlayMessage(null);
                  }
                }}
              >
                {card ? cardImg(card, () => setZoomCard(card)) : "Tu zona"}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/*Zona de manos*/}
      <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end space-y-2 bg-neutral-900 p-2 rounded-lg border border-white shadow-lg">
        {Object.entries(hands).map(([playerId, hand]) => (
          <div key={playerId} className="flex flex-col items-end">
            <Hand
              cards={hand}
              isOpponent={playerId !== currentTurn}
              onCardHover={(card) => setZoomCard(card)}
              isCurrentPlayer={currentTurn === playerId}
            />
            <span className="text-s bg-neutral-950 rounded px-2">
              {playerId === currentTurn ? "Tu mano" : `Mano de ${playerId}`}
            </span>
          </div>
        ))}
      </div>

      {zoomCard && (
        <div className="absolute top-4 right-4 bg-neutral-900 p-2 rounded border border-white">
          <div className="flex flex-col items-center">
            <img
              src={`/cards/${zoomCard.name}.png`}
              alt={zoomCard.name}
              className="w-[200px] h-[300px] rounded"
            />
            {currentPhase === "Fase Inicial" &&
              zoomCard?.type !== "MONSTER" &&
              hands[currentTurn].includes(zoomCard) && (
                <button
                  className="mt-2 px-4 py-1 bg-white text-black rounded hover:cursor-pointer transition transform active:scale-95"
                  onClick={() => {
                    setSelectedCard(zoomCard);
                    setPlayMessage("Selecciona un slot para tu carta");
                  }}
                >
                  Jugar
                </button>
              )}
          </div>
        </div>
      )}

      {isDiscarding && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-neutral-700 p-4 rounded-md max-w-md w-full">
            <p>Elige {selectedCard?.cost} carta(s) a descartar</p>
            <div className="grid grid-cols-3 gap-2 place-items-center gap-y-3">
              {hands[currentTurn].map((card, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer transition transform ${
                    cardsToDiscard.some((c) => c.id === card.id)
                      ? "border-4 border-blue-700"
                      : ""
                  }`}
                  onClick={() => toggleCardToDiscard(card)}
                >
                  {cardImg(card)}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={confirmDiscard}
              >
                Confirmar Descarta
              </button>
            </div>
          </div>
        </div>
      )}

      {playMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded shadow-lg z-50">
          {playMessage}
        </div>
      )}
    </main>
  );
}
