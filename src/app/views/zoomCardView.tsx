'use client';
import React, { useState } from "react";
import Card, { EffectType } from "../models/card";
import Image from "next/image";
import { fetchCardEffect } from "../lib/gameHelpers/effects/cardEffect";
import phaseStore from "../stores/phaseStore";
import { toast } from "react-toastify";
import { cardInField } from "../stores/fieldStore";
import Field from "../models/field";

type ZoomedCardViewProps = {
  card: Card;
  onClose: () => void;
  gameId: string;
  myPlayerKey: string;
  field: Field;
};

const ZoomedCardView = ({
  card,
  onClose,
  gameId,
  myPlayerKey,
  field,
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

  const [showConfirm, setShowConfirm] = useState(false);

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
      onClose(); 
    } catch (error) {
      console.error("Failed to activate effect:", error);
      toast.error("Error al activar el efecto de la carta.");
    }
  };

  const handleDiscardClick = () => {
    setShowConfirm(true);
  };

  const confirmDiscard = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}/actions/discard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: myPlayerKey,
          cardId: card.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      toast.success(`Se ha descartado la carta ${name}`);
      setShowConfirm(false);
      onClose();
    } catch (error) {
      console.error("Failed to discard card:", error);
      toast.error("Error al descartar la carta.");
    }
  };

  const cancelDiscard = () => {
    setShowConfirm(false);
  };

  return (
    <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="flex items-start gap-6 bg-black/85 p-6 rounded-xl text-white shadow-2xl pointer-events-auto w-[400px]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl font-bold p-1 leading-none hover:text-gray-300 transition-colors duration-200"
          aria-label="Cerrar"
        >
          &times;
        </button>
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
          {effectType === EffectType.AA &&
            isTapped === false &&
            owner === myPlayerKey &&
            phaseStore.currentPhase === "Main Phase" &&
            phaseStore.currentTurn === myPlayerKey &&
            cardInField(field, id) && (
              <div className="w-full mt-4">
                <button
                  onClick={handleEffectClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  disabled={!effectId}
                >
                  Activar Efecto
                </button>
              </div>
            )}

          {owner === myPlayerKey &&
            phaseStore.currentTurn === myPlayerKey &&
            cardInField(field, id) && (
              <div className="w-full mt-2">
                {!showConfirm ? (
                  <button
                    onClick={handleDiscardClick}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Descartar
                  </button>
                ) : (
                  <div className="text-center p-2 rounded-lg bg-gray-700">
                    <p className="mb-2">
                      ¿Descartar {name}?
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={confirmDiscard}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        Sí
                      </button>
                      <button
                        onClick={cancelDiscard}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ZoomedCardView;