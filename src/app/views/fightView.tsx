import React from "react";
import { observer } from "mobx-react-lite";
import gameStore from "../stores/gameStore";
import fightActions from "../stores/actions/fightActions";

const FightView = observer(() => {
  const { selectedRow, selectedMonsters, selectedWeapons, favorSpent } =
    fightActions.fightState;
  const fieldRow =
    selectedRow !== null ? gameStore.field.slots[selectedRow] : [];
  const player = gameStore.players[gameStore.currentTurn];

  const handleFavorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) fightActions.setFavorSpent(value);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-neutral-600 rounded-xl p-6 w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          ⚔️ Combate en Fila {selectedRow! + 1}
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <h3 className="font-semibold mb-2">Monstruos:</h3>
            <div className="flex flex-wrap gap-2">
              {fieldRow
                .map((slot) => slot.card)
                .filter((card) => card?.type === "MONSTER")
                .map((monster) => (
                  <img
                    key={monster!.id}
                    src={`/cards/${monster!.name}.png`}
                    alt={monster!.name}
                    className={`w-20 h-28 rounded cursor-pointer border-4 ${
                      selectedMonsters.includes(monster!)
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                    onClick={() => fightActions.selectMonster(monster!)}
                  />
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tus armas en esta fila:</h3>
            <div className="flex flex-wrap gap-2">
              {fieldRow
                .filter(
                  (slot) =>
                    slot.owner === gameStore.currentTurn &&
                    slot.card?.type === "WEAPON"
                )
                .map((slot) => (
                  <img
                    key={slot.card!.id}
                    src={`/cards/${slot.card!.name}.png`}
                    alt={slot.card!.name}
                    className={`w-20 h-28 rounded cursor-pointer border-4 ${
                      selectedWeapons.includes(slot.card!)
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => fightActions.selectWeapon(slot.card!)}
                  />
                ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="font-semibold">
            Favor gastado (máx. {player.favorPoints}):{" "}
          </label>
          <input
            type="number"
            value={favorSpent}
            onChange={handleFavorChange}
            min={0}
            max={player.favorPoints}
            className="border rounded px-2 py-1 w-20 ml-2"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => fightActions.cancelFight()}
            className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
          >
            Cancelar
          </button>
          <button
            onClick={() => fightActions.fight()}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Confirmar Combate
          </button>
        </div>
      </div>
    </div>
  );
});

export default FightView;
