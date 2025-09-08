'use client';
import React from "react";
import Card from "../models/card";
import Image from "next/image";

type ZoomedCardViewProps = {
  card: Card;
  onClose: () => void;
  gameId: string;
  myPlayerKey: string;
};

const ZoomedCardView = ({
  card,
  onClose,
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
  } = card;
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
        </div>
      </div>
    </div>
  );
};

export default ZoomedCardView;
