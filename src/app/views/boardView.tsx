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
      <div className="grid grid-cols-5 gap-1 flex-grow">
        {/* Col 1*/}
        <InfoPanelView />

        {/* Col 2 */}
        <div className="flex flex-col justify-end h-180 overflow-visible relative">
          <p className="flex h-6 bg-neutral-700 justify-center text-m font-bold">
            Mano de {gameStore.players[gameStore.currentTurn].name}
          </p>

          <HandView
            hand={gameStore.hands[gameStore.currentTurn]}
            onCardClick={(card) => cardActions.selectCard(card)}
          />

          {cardActions.selectedCard && (
            <ZoomedCardView
              card={cardActions.selectedCard}
              onClose={() => cardActions.selectCard(null)}
            />
          )}
        </div>

        {/* Col 3 */}
        <div className="h-full flex justify-center items-center -mr-120 -mt-12">
          <FieldView field={gameStore.field} />
          <ActionsView />
        </div>

        <div></div>
        <div></div>
      </div>



      <DiscardView />
      <ToastProvider />
    </main>
  );
});

export default BoardView;
