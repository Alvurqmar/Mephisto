'use client';
import { observer } from "mobx-react";
import React from "react";
import Field from "../models/field";
import { EmptySlot } from "../models/slot";
import cardActions from "../stores/actions/cardActions";
import lootActions from "../stores/actions/lootActions";
import summonActions from "../stores/actions/summonActions";
import phaseStore from "../stores/phaseStore";
import Image from "next/image";

type FieldProps = {
  field: Field;
  gameId: string;
};

const FieldView = ({ field, gameId }: FieldProps) => {
  return (
    <div className="w-full h-full max-w-screen max-h-screen mx-auto p-2 overflow-y-auto overflow-x-hidden flex justify-center items-start pt-20">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${field.columns}, 8rem)`,
          gridTemplateRows: `repeat(${field.rows}, 12rem)`,
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

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`border bg-neutral-700 rounded relative flex items-center justify-center`}
                style={{
                  width: "6rem",
                  height: "9rem",
                  minWidth: "6rem",
                  minHeight: "9rem",
                  position: "relative",
                  zIndex: field.rows - rowIndex,
                }}
                onClick={async () => {
                  const isLoot =
                    phaseStore.currentPhase === "Action Phase" &&
                    phaseStore.phaseAction === "Loot";
                  const isSummon =
                    phaseStore.currentPhase === "Action Phase" &&
                    phaseStore.phaseAction === "Summon";

                  if (isLoot) {
                    if (
                      card &&
                      (!slot.owner || slot.owner === phaseStore.currentTurn)
                    ) {
                      lootActions.lootField(
                        rowIndex,
                        colIndex,
                        gameId,
                        phaseStore.currentTurn
                      );
                    }
                  } else if (isSummon) {
                    if (
                      card &&
                      cardActions.selectedCard &&
                      cardActions.selectedCard.type === "MONSTER"
                    ) {
                      summonActions.summon(gameId, rowIndex, colIndex);
                    }
                  } else {
                    if (card) {
                      cardActions.selectCard(card);
                    } else if (cardActions.selectedCard) {
                      cardActions.playCard(rowIndex, colIndex, gameId);
                    }
                  }
                }}
              >
                {card && (
                  <div className="relative w-full h-full">
                    <Image
                      src={`/cards/${card.name}.png`}
                      alt={card.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover rounded pointer-events-none"
                    />
                  </div>
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
