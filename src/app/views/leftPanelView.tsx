'use client'
import { observer } from "mobx-react";
import React from "react";
import gameStore from "../stores/gameStore";
import DiscardPileView from "./discardPileView";

const LeftPanelView = () => {
  return (
    <div className="flex flex-col h-full w-[110px]">
      <div className="h-[100px] border rounded bg-green-800/80 flex flex-col items-center justify-center mb-auto">
        <p>P1: {gameStore.players["p1"].name}</p>
        <p>🌀SP: {gameStore.players["p1"].soulPoints}</p>
        <p>✨FP: {gameStore.players["p1"].favorPoints}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative inline-block">
          <img
            src="/cards/CardBack.png"
            alt="Deck"
            className="w-24 h-36 rounded shadow-lg"
          />
          <div className="absolute top-14 left-2.5 bg-neutral-500/50 text-white px-2 rounded">
            Deck: {gameStore.deck.length}
          </div>
        </div>

        <DiscardPileView discardPile={gameStore.discardPile} />
      </div>

      <div className="h-[100px] border rounded bg-rose-700/80 flex flex-col items-center justify-center mt-auto">
        <p>P2: {gameStore.players["p2"].name}</p>
        <p>🌀SP: {gameStore.players["p2"].soulPoints}</p>
        <p>✨FP: {gameStore.players["p2"].favorPoints}</p>
      </div>
    </div>
  );
};

export default observer(LeftPanelView);
