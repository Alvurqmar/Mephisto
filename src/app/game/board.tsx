"use client";

import { useState, useEffect, useReducer } from "react";
import {
  initialState,
  gameReducer,
  Player,
} from "../components/hooks/gameState";
import { useDiscard } from "../components/hooks/discardActions";
import PlayerComponent from "../components/player";
import Card, { cardImg } from "../components/card";
import Hand from "../components/hand";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const {
    fieldCards,
    playerFields,
    hands,
    currentTurn,
    currentPhase,
    phaseAction,
    selectedCard,
  } = gameState;

  const [player1Favor] = useState(3);
  const [player2Favor] = useState(5);
  const [zoomCard, setZoomCard] = useState<Card | null>(null);
  const [playMessage, setPlayMessage] = useState<string | null>(null);

  const discard = useDiscard({
    hand: hands[currentTurn],
    onDiscardComplete: (discardedCards) => {
      dispatch({
        type: "REMOVE_CARD_HAND",
        payload: { playerId: currentTurn, cards: discardedCards },
      });
      discard.resetDiscard();
    },
  });

  useEffect(() => {
    async function fetchCards() {
      const res = await fetch("/api/cards");
      const data = await res.json();
      dispatch({ type: "INIT_GAME", payload: { cards: data } });
    }
    fetchCards();
  }, []);

  const changePhase = () => {
    dispatch({ type: "CHANGE_PHASE" });
  };

  const playCard = (
    playerId: Player,
    card: Card,
    lane: number,
    slot: number
  ) => {
    if (hands[currentTurn].length < card.cost) {
      setPlayMessage(
        `Para jugar esta carta necesitas tener ${card.cost} cartas en mano`
      );
      return;
    }

    dispatch({
      type: "PLAY_CARD",
      payload: { playerId, card, lane, slot },
    });

    if (card.cost > 0) {
      discard.startDiscard(card.cost);
    }
    setPlayMessage(null);
  };

  const handleSelectCard = (card: Card) => {
    dispatch({ type: "SELECT_CARD", payload: card });
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden p-2 relative">
      <div className="grid grid-cols-5 gap-1 flex-grow items-center">
        {/*Zona info y Deck*/}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-[110px] h-[100px] border rounded bg-neutral-800 flex items-center justify-center">
            <PlayerComponent
              id="p2"
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
          <p className="rounded bg-neutral-800 ">
            Fase actual: {currentPhase}
            {currentPhase === "Action Phase" &&
              gameState.phaseAction &&
              ` -  ${gameState.phaseAction}`}
          </p>

          <div className="w-[110px] h-[100px] border rounded bg-neutral-800 flex items-center justify-center">
            <PlayerComponent
              id ="p1"
              name="Jugador 1"
              favor={player1Favor}
              soulPoints={0}
            />
          </div>
        </div>
        {/*Zona de juego*/}
        {[0, 1, 2].map((laneIndex) => (
          <div key={laneIndex} className="flex flex-col items-center space-y-3">
            {/* Zona del jugador 2 (arriba) */}
            {playerFields.player2[laneIndex].map((card, idx) => (
              <div
                key={`p2-${laneIndex}-${idx}`}
                className={`w-[80px] h-[100px] border border-dashed rounded flex items-center justify-center ${
                  !card && selectedCard
                    ? "hover:bg-green-800 cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (!card && selectedCard && currentTurn === "player2") {
                    playCard("player2", selectedCard, laneIndex, idx);
                  }
                }}
              >
                {card ? cardImg(card, () => setZoomCard(card)) : "Zona rival"}
              </div>
            ))}

            {/* Campo de batalla: dos cartas por linea */}
            <div className="w-[80px] h-[100px]">
              {fieldCards[laneIndex][0] &&
                cardImg(fieldCards[laneIndex][0], () =>
                  setZoomCard(fieldCards[laneIndex][0])
                )}
            </div>
            <div className="w-[80px] h-[100px]">
              {fieldCards[laneIndex][1] &&
                cardImg(fieldCards[laneIndex][1], () =>
                  setZoomCard(fieldCards[laneIndex][1])
                )}
            </div>

            {/* Zona del jugador 1 (abajo) */}
            {playerFields.player1[laneIndex].map((card, idx) => (
              <div
                key={`p1-${laneIndex}-${idx}`}
                className={`w-[80px] h-[100px] border border-dashed rounded flex items-center justify-center ${
                  !card && selectedCard
                    ? "hover:bg-green-800 cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (!card && selectedCard && currentTurn === "player1") {
                    playCard("player1", selectedCard, laneIndex, idx);
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

      {/* Zoom de carta */}
      {zoomCard && (
        <div className="absolute top-4 right-4 bg-neutral-900 p-2 rounded border border-white">
          <div className="flex flex-col items-center">
            <img
              src={`/cards/${zoomCard.name}.png`}
              alt={zoomCard.name}
              className="w-[200px] h-[300px] rounded"
            />
            {currentPhase === "Main Phase" &&
              zoomCard?.type !== "MONSTER" &&
              hands[currentTurn].includes(zoomCard) && (
                <button
                  className="mt-2 px-4 py-1 bg-white text-black rounded hover:cursor-pointer transition transform active:scale-95"
                  onClick={() => {
                    handleSelectCard(zoomCard);
                    setPlayMessage("Selecciona un slot para tu carta");
                  }}
                >
                  Jugar
                </button>
              )}
          </div>
        </div>
      )}

      {/* Modal de descarte */}
      {discard.Discarding && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-neutral-700 p-4 rounded-md max-w-md w-full">
            <p>Elige {discard.requiredCards} carta(s) a descartar</p>
            <div className="grid grid-cols-3 gap-2 place-items-center gap-y-3">
              {hands[currentTurn].map((card, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer transition transform ${
                    discard.cardsToDiscard.some((c) => c.id === card.id)
                      ? "border-4 border-blue-700"
                      : ""
                  }`}
                  onClick={() => discard.toggleCardToDiscard(card)}
                >
                  {cardImg(card)}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={discard.confirmDiscard}
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
      {/* Selector de acción para "Action Phase" */}
      {currentPhase === "Action Phase" && gameState.phaseAction === null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 p-6 rounded shadow-xl border border-white flex flex-col space-y-4 z-50">
          <p className="text-lg font-bold text-white">Elige una acción:</p>
          <div className="flex space-x-4">
            {["LOOT", "FIGHT", "SUMMON"].map((choice) => (
              <button
                key={choice}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                onClick={() =>
                  dispatch({ type: "PHASE_ACTION", payload: choice as any })
                }
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
