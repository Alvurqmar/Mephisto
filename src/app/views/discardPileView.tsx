'use client'
import React, { useState } from "react";
import { observer } from "mobx-react";
import DiscardPile from "../models/discardPile";
import Image from "next/image";

interface DiscardPileViewProps {
  discardPile: DiscardPile;
}

const DiscardPileView = observer(({ discardPile }: DiscardPileViewProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const lastCard =
    discardPile.cards.length > 0
      ? `/cards/${discardPile.cards[discardPile.cards.length - 1].name}.png`
      : "/cards/CardBack.png";

  return (
    <div className="mt-4 relative flex flex-col items-center">
      <Image
        src={lastCard}
        alt="Última descartada"
        width={96}
        height={144}
        className="rounded shadow cursor-pointer"
        onClick={handleOpen}
      />
      <div className="absolute top-14 bg-neutral-500/50 text-white px-2 rounded flex flex-col items-center">
        <span>Descartes:</span>
        <span>{discardPile.cards.length}</span>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-neutral-700 rounded-lg p-4 w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Cartas descartadas</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {discardPile.cards.map((card, index) => (
                <Image
                  key={`${card.id}-${index}`}
                  src={`/cards/${card.name}.png`}
                  alt={card.name}
                  width={80} 
                  height={112} 
                  className="w-20 h-28"
                />
              ))}
            </div>
            <button
              onClick={handleClose}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default DiscardPileView;
