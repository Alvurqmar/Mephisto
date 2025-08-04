import ToastProvider from "@/app/ui/toastProvider";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import cardActions from "../stores/actions/cardActions";
import cardSelection from "../stores/cardEffects/cardSelection";
import gameStore from "../stores/gameStore";
import ActionsView from "./actionsView";
import DiscardView from "./discardView";
import FieldView from "./fieldView";
import HandView from "./handView";
import LeftPanelView from "./leftPanelView";
import RightPanelView from "./rightPanelView";
import ZoomedCardView from "./zoomCardView";

const BoardView = observer(() => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await gameStore.loadCards();
      gameStore.loadPlayers();
      gameStore.initGame();
      setIsReady(true);
    }
    init();
  }, []);

  if (!isReady) {
    return (
      <div className="h-screen bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center flex items-center justify-center">
        Cargando...
      </div>
    );
  }

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
            Mano de {gameStore.players[gameStore.currentTurn].name}
          </p>

          <HandView
            hand={gameStore.hands[gameStore.currentTurn]}
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
          <FieldView field={gameStore.field} />
        </div>
        {/* Col 4 - LeftPanelView*/}
        <div className="flex-none w-32 max-h-screen">
          <RightPanelView />
        </div>
      </div>
      <DiscardView />
      <ToastProvider />
    </main>
  );
});

export default BoardView;
