import { observer } from "mobx-react";
import React from "react";
import Field from "../models/field";
import { EmptySlot } from "../models/slot";
import cardActions from "../stores/actions/cardActions";
import lootActions from "../stores/actions/lootActions";
import phaseActions from "../stores/actions/phaseActions";
import summonActions from "../stores/actions/summonActions";
import cardSelection from "../stores/cardEffects/cardSelection";
import gameStore from "../stores/gameStore";

type FieldViewProps = {
  field: Field;
};

const FieldView = ({ field }: FieldViewProps) => {
  const { active: selectionActive, filter: selectionFilter } = cardSelection;

  return (
    <div className="w-full h-full max-w-screen max-h-screen mx-auto p-2 overflow-y-auto overflow-x-hidden flex justify-center items-start pt-20">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${field.columns}, 6rem)`,
          gridTemplateRows: `repeat(${field.rows}, 9rem)`,
          minWidth: "100%",
          minHeight: field.rows * 144,
          boxSizing: "content-box",
        }}
      >
        {field.slots.map((row, rowIndex) =>
          row.map((slot, colIndex) => {
            if (slot instanceof EmptySlot) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="opacity-0 pointer-events-none"
                  style={{ width: "6rem", height: "9rem" }}
                />
              );
            }

            const card =
              slot.card && typeof slot.card !== "string" ? slot.card : null;
            const isSelectable =
              selectionActive &&
              card &&
              selectionFilter &&
              selectionFilter(card);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`border bg-neutral-700 rounded relative flex items-center justify-center
                  ${isSelectable ? "cursor-pointer ring-4 ring-blue-400" : ""}`}
                style={{
                  width: "6rem",
                  height: "9rem",
                  minWidth: "6rem",
                  minHeight: "9rem",
                  position: "relative",
                  zIndex: field.rows - rowIndex,
                }}
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
                        if (wasSuccessful) phaseActions.changePhase();
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
                    className="w-full h-full object-cover rounded pointer-events-none"
                  />
                )}

                <span className="absolute bottom-1 right-1 text-xs px-1 rounded bg-black bg-opacity-60 text-white select-none">
                  {slot.owner ?? ""}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default observer(FieldView);
