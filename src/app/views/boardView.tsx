import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import gameStore from "../stores/gameStore";
import HandView from "./handView";
import FieldView from "./fieldView";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/app/ui/toastProvider";
import ZoomedCardView from "./zoomCardView";
import InfoPanelView from "./infoPanelView";
import DiscardView from "./discardView";
import cardActions from "../stores/actions/cardActions";
import ActionsView from "./actionsView";
import cardSelection from "../stores/cardEffects/cardSelection";

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
      <div className="h-screen bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center">
        Cargando...
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center">
      <div className="flex flex-grow gap-x-4 px-4">
        {/* Col 1 - InfoPanelView */}
        <div className="flex-grow max-w-xs">
          <InfoPanelView />
        </div>

        {/* Col 2 - Mano y ZoomedCard */}
        <div className="flex-grow max-w-md flex flex-col justify-end relative">
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
        </div>

        {/* Col 3 - Campo y Acciones */}
        <div className="flex-grow max-w-lg flex justify-center items-center -mt-12">
          <FieldView field={gameStore.field} />
          <ActionsView />
        </div>
      </div>

      <DiscardView />
      <ToastProvider />
    </main>
  );
});

export default BoardView;
