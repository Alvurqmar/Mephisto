'use client'
import { observer } from "mobx-react";
import React from "react";
import fightActions from "../stores/actions/fightActions";
import lootActions from "../stores/actions/lootActions";
import phaseActions from "../stores/actions/phaseActions";
import gameStore from "../stores/gameStore";
import FightView from "./fightView";

const ActionsView = () => {
  const { currentPhase, phaseAction } = gameStore;

  if (currentPhase !== "Action Phase") return null;

  if (!phaseAction) {
    return (
      <div className="absolute top-6 bg-neutral-400 px-6 py-4 rounded shadow-md text-neutral-800">
        <h1 className="font-bold mb-2 text-center">
          Elige una acción (o pasa de fase):
        </h1>
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
      const { orientation, validIndexes } = fightActions.orientation();
      const isRows = orientation === "rows";

      return (
        <div className="absolute top-6 z-50 bg-neutral-400 p-4 rounded shadow text-neutral-800">
          <h1 className="font-bold mb-2 text-center">
            Selecciona una {isRows ? "fila" : "columna"} para combatir:
          </h1>

          <div className="flex gap-2 justify-center flex-wrap">
            {validIndexes.map((index) => (
              <button
                key={index}
                onClick={() => fightActions.startFight(index)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                {isRows ? `Fila ${index + 1}` : `Columna ${index + 1}`}
              </button>
            ))}
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
  }

  if (phaseAction === "Loot") {
    return (
      <div className="absolute top-4 z-50 bg-neutral-400 px-6 py-3 rounded shadow-md text-neutral-800 w-max">
        <h1 className="mb-2 text-center font-semibold">
          Haz click en una carta en la dungeon para robarla,
          <br />o roba una carta del mazo:
        </h1>

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
      <div className="absolute top-4 z-50 bg-neutral-400 px-6 py-3 rounded shadow-md text-neutral-800 w-max">
        <h1 className="mb-2 text-center font-semibold">
          Selecciona un monstruo de tu mano para invocar.
        </h1>

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
