import React from "react";
import Card from "../models/card";

type ZoomedCardViewProps = {
  card: Card;
  onClose: () => void;
};

const ZoomedCardView = ({ card, onClose }: ZoomedCardViewProps) => {
  const { name, type, cost, soulpts, attack, durability, owner } = card;

  return (
    <div
      className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      onClick={onClose}
    >
      <div className="flex items-start gap-6 bg-black/85 p-6 rounded-xl text-white shadow-2xl pointer-events-auto w-[400px]">
        <img
          src={`/cards/${name}.png`}
          alt={name}
          className="w-48 h-64 rounded shadow-lg"
        />

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
              <strong>🌀 SP:</strong> {soulpts}
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
          <p>{owner}</p>
        </div>
      </div>
    </div>
  );
};

export default ZoomedCardView;
