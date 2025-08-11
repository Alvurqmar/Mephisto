'use client'
import React from "react";
import Card from "../models/card";
import effectResolver from "../stores/cardEffects/effectResolver";
import cardActions from "../stores/actions/cardActions";
import phaseStore from "../stores/phaseStore";

type ZoomedCardViewProps = {
  card: Card;
  onClose: () => void;
};

const ZoomedCardView = ({ card, onClose }: ZoomedCardViewProps) => {
  const { name, type, cost, soulPts, attack, durability, owner, effectType, isTapped } =
    card;

  return (
    <div
      className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      onClick={onClose}
    >
      <div className="flex items-start gap-6 bg-black/85 p-6 rounded-xl text-white shadow-2xl pointer-events-auto w-[400px]">
        <div className="relative w-48 h-64 rounded shadow-lg overflow-hidden">
          <img
            src={`/cards/${name}.png`}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-300`}
          />
          {isTapped && (
            <div className="absolute bottom-1 right-1 p-1 rounded-full">
              <img
                src="/tapIcon.png"
                alt="Carta tapada"
                className="w-6 h-6"
              />
            </div>
          )}
        </div>

        <div className="space-y-2 text-base">
          <p className="font-bold text-xl">{name}</p>
          {type !== "MONSTER" && (
            <p>
              <strong>🧪 Coste:</strong> {cost}
            </p>
          )}
          <p>
            <strong>📖 Tipo:</strong> {type}
          </p>
          {type !== "WEAPON" && type !== "ITEM" && type !== "SPELL" && (
            <p>
              <strong>🌀 SP:</strong> {soulPts}
            </p>
          )}
          {type !== "ITEM" && type !== "SPELL" && (
            <p>
              <strong>🗡️ ATK:</strong> {attack}
            </p>
          )}
          {type !== "MONSTER" && type !== "SPELL" && (
            <p>
              <strong>🛡️ Durabilidad:</strong> {durability}
            </p>
          )}
          {isTapped && (
            <p>
              <strong> (Girada)</strong>
            </p>
          )}
          {effectType === "AA" &&
            phaseStore.currentPhase === "Main Phase" &&
            !isTapped && cardActions.slotIsOwned(card) && owner == phaseStore.currentTurn &&(
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded mt-4 hover:bg-indigo-700 transition pointer-events-auto"
                onClick={() => {
                  effectResolver.trigger(card);
                  card.durability += -1;
                  onClose();
                }}
              >
                Activar habilidad
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ZoomedCardView;