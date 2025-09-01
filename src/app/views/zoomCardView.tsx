"use client";
import React from "react";
import Card, { EffectType } from "../models/card";
import phaseStore from "../stores/phaseStore";
import { findCardById, loadGameState } from "../lib/Helpers";
import { toast } from "react-toastify";

type ZoomedCardViewProps = {
  card: Card;
  onClose: () => void;
  gameId: string;
  myPlayerKey: string;
};

const ZoomedCardView = ({
  card,
  onClose,
  gameId,
  myPlayerKey,
}: ZoomedCardViewProps) => {
  const {
    id,
    name,
    type,
    cost,
    soulPts,
    attack,
    durability,
    owner,
    effectType,
    effectId,
    isTapped,
  } = card;
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
              <img src="/tapIcon.png" alt="Carta tapada" className="w-6 h-6" />
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
          {owner !== null && (
            <p>
              <strong>👤 Propietario:</strong> {owner}
            </p>
          )}
          {effectType === EffectType.AA &&
            !isTapped &&
            owner === myPlayerKey &&
            phaseStore.currentPhase === "Main Phase" && (
              <button
                className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition text-sm font-semibold"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `/api/games/${gameId}/actions/cardEffect`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          playerId: card.owner,
                          cardId: card.id,
                          effectId: effectId,
                          effectType: effectType,
                        }),
                      }
                    );

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    if (data.message) {
                      toast.success(data.message);
                    }
                  } catch (err) {
                    console.error(err);
                  }
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
