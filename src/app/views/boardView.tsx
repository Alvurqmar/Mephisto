'use client';
import ToastProvider from "@/app/ui/toastProvider";
import { observer } from "mobx-react";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import cardActions from "../stores/actions/cardActions";
import gameStore from "../stores/gameStore";
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
import { pusherClient } from "../lib/pusherClient";
import TargetView from "./targetView";

type BoardViewProps = {
  gameId: string;
};
const BoardView = observer(({ gameId }: BoardViewProps) => {
  const myPlayerKey = sessionStorage.getItem(`playerKey-${gameId}`);

  useEffect(() => {
    async function init() {
      if (!gameStore.isLoaded) {
        await gameStore.loadGameState(gameId);
      }
    }
    init();

    const channel = pusherClient.subscribe(`game-${gameId}`);

    const onStateUpdated = () => {
      gameStore.loadGameState(gameId);
    };

    channel.bind("state-updated", onStateUpdated);

    return () => {
      channel.unbind("state-updated", onStateUpdated);
      pusherClient.unsubscribe(`game-${gameId}`);
    };
  }, [gameId]);

  if (!gameStore.isLoaded) {
    return (
      <div className="h-screen bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-4 border-gray-400 animate-spin border-t-transparent"></div>
        <p className="mt-4 text-white">Cargando...</p>
      </div>
    );
  }

  const myPlayer = myPlayerKey ? playerStore.players[myPlayerKey] : null;

  const myHand = myPlayerKey ? handStore.hands[myPlayerKey] : null;

  return (
    <main className="flex flex-col h-screen max-w-screen overflow-hidden bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center">
      {gameStore.isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="w-6 h-6 rounded-full border-2 border-t-2 border-white animate-spin border-t-transparent"></div>
        </div>
      )}

      <div className="flex flex-grow gap-1 h-full min-h-0">
        {/* Col 1 - InfoPanelView */}
        <div className="flex-none w-35 max-h-screen">
          <LeftPanelView />
        </div>

        {/* Col 2 - Mano , ZoomedCard y Acciones */}
        <div className="flex-none w-96 flex flex-col justify-end relative">
          <p className="flex h-6 bg-neutral-700 justify-center text-m font-bold">
            Mano de {myPlayer ? myPlayer.name : "Jugador"}
          </p>

          {myHand && (
            <HandView
              hand={myHand}
              onCardClick={(card) => {
                cardActions.selectCard(card);
              }}
            />
          )}

          {cardActions.selectedCard && myPlayerKey && (
            <ZoomedCardView
              card={cardActions.selectedCard}
              onClose={() => cardActions.selectCard(null)}
              gameId={gameId}
              myPlayerKey={myPlayerKey}
              field={fieldStore.field}
            />
          )}

          {myPlayerKey && (
            <ActionsView gameId={gameId} myPlayerKey={myPlayerKey} />
          )}
        </div>

        {/* Col 3 - Campo */}
        <div className="flex-grow flex justify-center items-center h-full min-h-0 overflow-hidden">
          <FieldView field={fieldStore.field} gameId={gameId} />
        </div>

        {/* Col 4 - RightPanelView */}
        <div className="flex-none w-32 max-h-screen">
          {myPlayerKey && (
            <RightPanelView gameId={gameId} myPlayerKey={myPlayerKey} />
          )}
        </div>
      </div>

      <DiscardView gameId={gameId} />
      <TargetView field={fieldStore.field} />
      <ToastProvider />

      {/* Victoria */}
      {phaseStore.status === "Finished" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-neutral-600 rounded-xl p-6 shadow-lg text-center max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              🎉{" "}
              {Object.values(playerStore.players).find((p) => p.isWinner)?.name}{" "}
              ha ganado la partida!
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
