import React from "react";
import { observer } from "mobx-react";
import Field, { Slot } from "../models/field";
import gameStore from "../stores/gameStore";
import gameActions from "../stores/gameActions";

type FieldViewProps = {
  field: Field;
};

const FieldView = ({ field }: FieldViewProps) => {
  return (
    <div className="grid grid-rows-3 grid-cols-6 gap-1">
      {field.slots.map((row, rowIndex) =>
        row.map((slot, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="w-24 h-36 border bg-neutral-700 rounded relative flex items-center justify-center"
            onClick={() => {
              const isLoot =
                gameStore.currentPhase === "Action Phase" &&
                gameStore.phaseAction === "Loot";
              const isSummon =
                gameStore.currentPhase === "Action Phase" &&
                gameStore.phaseAction === "Summon";

              if (isLoot) {
                if (
                  slot.card &&
                  (!slot.owner || slot.owner === gameStore.currentTurn)
                ) {
                  gameActions.lootField(rowIndex, colIndex);
                  gameActions.changePhase();
                }
              } else if (isSummon) {
                if (
                  slot.card &&
                  gameActions.selectedCard &&
                  gameActions.selectedCard.type === "MONSTER"
                ) {
                  gameActions.summon(rowIndex, colIndex);
                  gameActions.changePhase();
                }
              } else {
                if (slot.card) {
                  gameActions.selectCard(slot.card);
                } else if (gameActions.selectedCard) {
                  gameActions.playCard(rowIndex, colIndex);
                }
              }
            }}
          >
            {slot.card && typeof slot.card !== "string" && (
              <img
                src={`/cards/${slot.card.name}.png`}
                alt={slot.card.name}
                className="w-full h-full object-cover rounded cursor-pointer"
              />
            )}

            <span className="absolute bottom-1 right-1 text-xs px-1 rounded bg-black bg-opacity-60 text-white">
              {slot.owner ?? ""}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default observer(FieldView);
