import React from "react";
import { observer } from "mobx-react";
import Field, { Slot } from "../models/field";
import gameStore from "../stores/gameStore";
import lootActions from "../stores/actions/lootActions";
import phaseActions from "../stores/actions/phaseActions";
import cardActions from "../stores/actions/cardActions";
import summonActions from "../stores/actions/summonActions";

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
                  lootActions.lootField(rowIndex, colIndex);
                  phaseActions.changePhase();
                }
              } else if (isSummon) {
                if (
                  slot.card &&
                  cardActions.selectedCard &&
                  cardActions.selectedCard.type === "MONSTER"
                ) {
                  summonActions.summon(rowIndex, colIndex);
                  phaseActions.changePhase();
                }
              } else {
                if (slot.card) {
                  cardActions.selectCard(slot.card);
                } else if (cardActions.selectedCard) {
                  cardActions.playCard(rowIndex, colIndex);
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
