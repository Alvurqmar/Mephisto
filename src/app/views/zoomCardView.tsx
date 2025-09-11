'use client';
import React from "react";
import Card, { EffectType } from "../models/card";
import Image from "next/image";
import { fetchCardEffect } from "../lib/gameHelpers/effects/cardEffect";
import phaseStore from "../stores/phaseStore";
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
    name,
    type,
    cost,
    soulPts,
    attack,
    durability,
    owner,
    isTapped,
    effectId,
    effectType,
    id,
  } = card;

  const handleEffectClick = async () => {
    if (!effectId) {
      console.warn("This card has no effect");
      return;
    }
    
    try {
      await fetchCardEffect(
        phaseStore.currentTurn,
        effectId,
        id.toString(),
        gameId
      );
    } catch (error) {
      console.error("Failed to activate effect:", error);
      toast.error("Error al activar el efecto de la carta.");
    }
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      onClick={onClose}
    >
      <div className="flex items-start gap-6 bg-black/85 p-6 rounded-xl text-white shadow-2xl pointer-events-auto w-[400px]">
        <div className="relative w-48 h-64 rounded shadow-lg overflow-hidden">
          <Image
            src={`/cards/${name}.png`}
            alt={name}
            fill
            className="object-cover transition-transform duration-300"
            sizes="200px"
          />
          {isTapped && (
            <div className="absolute bottom-1 right-1 p-1 rounded-full">
              <Image
                src="/tapIcon.png"
                alt="Carta tapada"
                width={24}
                height={24}
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
          {owner !== null && (
            <p>
              <strong>👤 Propietario:</strong> {owner}
            </p>
          )}
          {effectType === EffectType.AA && isTapped === false && owner === myPlayerKey && phaseStore.currentPhase === "Main Phase" && phaseStore.currentTurn === myPlayerKey &&(
          <div className="w-full mt-4">
            <button
              onClick={() => {
                handleEffectClick();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              disabled={!effectId}
            >
              Activar Efecto
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoomedCardView;