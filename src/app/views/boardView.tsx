import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import gameStore from "../stores/gameStore";
import HandView from "./handView";
import FieldView from "./fieldView";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/app/ui/toastProvider";
import ZoomedCardView from "./zoomCardView";
import InfoPanelView from "./infoPanelView";
import FightView from "./fightView";
import DiscardView from "./discardView";
import cardActions from "../stores/actions/cardActions";
import fightActions from "../stores/actions/fightActions";
import lootActions from "../stores/actions/lootActions";
import phaseActions from "../stores/actions/phaseActions";

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
        </div>

        <div></div>
        <div></div>
      </div>

      {gameStore.currentPhase === "Action Phase" && !gameStore.phaseAction && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-400 px-6 py-4 rounded shadow-md text-neutral-800">
          <h2 className="font-bold mb-2 text-center">Elige una acción:</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => phaseActions.setPhaseAction("Loot")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Loot
            </button>
            <button
              onClick={() => phaseActions.setPhaseAction("Summon")}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
            >
              Summon
            </button>

            <button
              onClick={() => phaseActions.setPhaseAction("Fight")}
              className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-800"
            >
              Fight
            </button>
          </div>
        </div>
      )}

      {gameStore.phaseAction === "Fight" &&
        fightActions.fightState.isActive && <FightView />}

      {gameStore.phaseAction === "Fight" &&
        !fightActions.fightState.isActive && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-400 p-4 rounded shadow">
            <h2 className="font-bold mb-2 text-center">
              Selecciona una fila para combatir:
            </h2>
            <div className="flex gap-2 justify-center">
              {[...Array(gameStore.field.rows)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fightActions.startFight(i)}
                  className="bg-orange-600 text-white px-4 py-1 rounded"
                >
                  Fila {i + 1}
                </button>
              ))}
              <button
                onClick={() => phaseActions.setPhaseAction(null)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

      {gameStore.currentPhase === "Action Phase" &&
        gameStore.phaseAction === "Loot" && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-400 px-6 py-3 rounded shadow-md text-neutral-800 w-max">
            <h3 className="mb-2 text-center font-semibold">
              Haz click en una carta en tu campo o en el dungeon para robarla, o
              roba una carta del mazo:
            </h3>
            <button
              onClick={() => {
                lootActions.lootDeck();
                phaseActions.changePhase();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Robar del mazo
            </button>
          </div>
        )}

      <DiscardView />
      <ToastProvider />
    </main>
  );
});

export default BoardView;
