import React from "react";
import { observer } from "mobx-react";
import Field, { Slot } from "../models/field";
import gameStore from "../stores/gameStore";
import lootActions from "../stores/actions/lootActions";
import phaseActions from "../stores/actions/phaseActions";
import cardActions from "../stores/actions/cardActions";
import summonActions from "../stores/actions/summonActions";
import cardSelection from "../stores/cardEffects/cardSelection";

type FieldViewProps = {
  field: Field;
};

const FieldView = ({ field }: FieldViewProps) => {
  const { active: selectionActive, filter: selectionFilter } = cardSelection;

  return (
    <div className="grid grid-rows-3 grid-cols-6 gap-x-20 gap-y-4">
      {field.slots.map((row, rowIndex) =>
        row.map((slot, colIndex) => {
          const card = slot.card && typeof slot.card !== "string" ? slot.card : null;

          const isSelectable = selectionActive && card && selectionFilter && selectionFilter(card);

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-24 h-36 border bg-neutral-700 rounded relative flex items-center justify-center
                ${isSelectable ? "cursor-pointer ring-4 ring-blue-400" : ""}
              `}
              onClick={() => {
                if (isSelectable) {
                  cardSelection.select(card);
                } else {
                  const isLoot =
                    gameStore.currentPhase === "Action Phase" &&
                    gameStore.phaseAction === "Loot";
                  const isSummon =
                    gameStore.currentPhase === "Action Phase" &&
                    gameStore.phaseAction === "Summon";

                  if (isLoot) {
                    if (
                      card &&
                      (!slot.owner || slot.owner === gameStore.currentTurn)
                    ) {
                      const wasSuccessful = lootActions.lootField(
                        rowIndex,
                        colIndex
                      );
                      if (wasSuccessful) {
                        phaseActions.changePhase();
                      }
                    }
                  } else if (isSummon) {
                    if (
                      card &&
                      cardActions.selectedCard &&
                      cardActions.selectedCard.type === "MONSTER"
                    ) {
                      summonActions.summon(rowIndex, colIndex);
                      phaseActions.changePhase();
                    }
                  } else {
                    if (card) {
                      cardActions.selectCard(card);
                    } else if (cardActions.selectedCard) {
                      cardActions.playCard(rowIndex, colIndex);
                    }
                  }
                }
              }}
            >
              {card && (
                <img
                  src={`/cards/${card.name}.png`}
                  alt={card.name}
                  className="w-full h-full object-cover rounded"
                />
              )}

              <span className="absolute bottom-1 right-1 text-xs px-1 rounded bg-black bg-opacity-60 text-white">
                {slot.owner ?? ""}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default observer(FieldView);
