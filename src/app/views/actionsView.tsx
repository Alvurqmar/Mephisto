import React from "react";
import { observer } from "mobx-react";
import gameStore from "../stores/gameStore";
import phaseActions from "../stores/actions/phaseActions";
import fightActions from "../stores/actions/fightActions";
import lootActions from "../stores/actions/lootActions";
import FightView from "./fightView";

const ActionsView = () => {
  const { currentPhase, phaseAction, field } = gameStore;

  if (currentPhase !== "Action Phase") return null;

  if (!phaseAction) {
    return (
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-400 px-6 py-4 rounded shadow-md text-neutral-800">
        <h2 className="font-bold mb-2 text-center">Elige una acción (o pasa de fase):</h2>
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
    );
  }

  if (phaseAction === "Fight") {
    if (fightActions.fightState.isActive) {
      return <FightView />;
    } else {
      return (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-400 p-4 rounded shadow">
          <h2 className="font-bold mb-2 text-center text-neutral-800">
            Selecciona una fila para combatir:
          </h2>
          <div className="flex gap-2 justify-center">
            {[...Array(field.rows)].map((_, i) => (
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
              Cambiar acción
            </button>
          </div>
        </div>
      );
    }
  }

  if (phaseAction === "Loot") {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-400 px-6 py-3 rounded shadow-md text-neutral-800 w-max">
        <h3 className="mb-2 text-center font-semibold">
          Haz click en una carta en tu campo o en el dungeon para robarla, o
          roba una carta del mazo:
        </h3>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              lootActions.lootDeck();
              phaseActions.changePhase();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Robar del mazo
          </button>

          <button
            onClick={() => phaseActions.setPhaseAction(null)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cambiar acción
          </button>
        </div>
      </div>
    );
  }

  if (phaseAction === "Summon") {
    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-400 px-6 py-3 rounded shadow-md text-neutral-800 w-max">
        <h3 className="mb-2 text-center font-semibold">
          Selecciona un monstruo de tu mano para invocar.
        </h3>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => phaseActions.setPhaseAction(null)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cambiar acción
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default observer(ActionsView);
