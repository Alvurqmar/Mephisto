'use client';

import ToastProvider from "@/app/ui/toastProvider";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import cardActions from "../stores/actions/cardActions";
import cardSelection from "../stores/cardEffects/cardSelection";
import gameStore from "../stores/gameStore";
import deckStore from "../stores/deckStore";
import ActionsView from "./actionsView";
import DiscardView from "./discardView";
import FieldView from "./fieldView";
import HandView from "./handView";
import LeftPanelView from "./leftPanelView";
import RightPanelView from "./rightPanelView";
import ZoomedCardView from "./zoomCardView";
import phaseStore from "../stores/phaseStore";
import playerStore from "../stores/playerStore";
import handStore from "../stores/handStore";
import fieldStore from "../stores/fieldStore";

type BoardViewProps = {
  gameId: string;
};

const BoardView = observer(({ gameId }: BoardViewProps) => {
  



  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await deckStore.loadCards();
      await gameStore.loadGameState(gameId);
      setIsReady(true);
    }
    init();
  }, [gameId]);

  if (!isReady) {
    return (
      <div className="h-screen bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  const currentPlayerKey = phaseStore.currentTurn;
  const currentPlayer = currentPlayerKey ? playerStore.players[currentPlayerKey] : null;
  const currentHand = currentPlayerKey ? handStore.hands[currentPlayerKey] : null;

  return (
    <main className="flex flex-col h-screen max-w-screen overflow-hidden bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="flex flex-grow gap-1 h-full min-h-0">
        {/* Col 1 - InfoPanelView */}
        <div className="flex-none w-35 max-h-screen">
          <LeftPanelView />
        </div>

        {/* Col 2 - Mano , ZoomedCard y Acciones */}
        <div className="flex-none w-96 flex flex-col justify-end relative">
          <p className="flex h-6 bg-neutral-700 justify-center text-m font-bold">
            Mano de {currentPlayer ? currentPlayer.name : "Jugador"}
          </p>

          {currentHand && (
            <HandView
              hand={currentHand}
              onCardClick={(card) => {
                if (cardSelection.handActive) {
                  cardSelection.selectFromHand(card);
                } else if (cardSelection.active) {
                  cardSelection.select(card);
                } else {
                  cardActions.selectCard(card);
                }
              }}
              selectableFilter={
                cardSelection.handActive
                  ? cardSelection.handFilter ?? (() => false)
                  : undefined
              }
            />
          )}

          {cardActions.selectedCard && (
            <ZoomedCardView
              card={cardActions.selectedCard}
              onClose={() => cardActions.selectCard(null)}
            />
          )}

          <ActionsView />
        </div>

        {/* Col 3 - Campo */}
        <div className="flex-grow flex justify-center items-center h-full min-h-0 overflow-hidden">
          <FieldView field={fieldStore.field} />
        </div>

        {/* Col 4 - RightPanelView */}
        <div className="flex-none w-32 max-h-screen">
          <RightPanelView />
        </div>
      </div>

      <DiscardView />
      <ToastProvider />

      {/* Victoria */}
      {phaseStore.status === "Finished" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-neutral-600 rounded-xl p-6 shadow-lg text-center max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              🎉 {Object.values(playerStore.players).find((p) => p.isWinner)?.name} ha ganado la partida!
            </h2>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded mt-4"
            >
              Volver al menú principal
            </button>
          </div>
        </div>
      )}
    </main>
  );
});

export default BoardView;
