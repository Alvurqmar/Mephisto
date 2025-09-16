'use client'
import { observer } from "mobx-react";
import React from "react";
import DiscardPileView from "./discardPileView";
import playerStore from "../stores/playerStore";
import deckStore from "../stores/deckStore";
import Image from "next/image";
import handStore from "../stores/handStore";

const LeftPanelView = () => {
  return (
    <div className="flex flex-col h-full w-[110px]">
      <div className="h-[120px] border rounded bg-green-800/80 flex flex-col items-center justify-center mb-auto">
        <p>P1: {playerStore.players["p1"].name}</p>
        <p>🌀SP: {playerStore.players["p1"].soulPoints}</p>
        <p>🔥FP: {playerStore.players["p1"].favorPoints}</p>
        <p>🃏Cartas: {handStore.hands["p1"].cards.length}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative inline-block">
          <Image
            src="/cards/CardBack.png"
            alt="Deck"
            width={96}
            height={144}
            className="rounded shadow-lg"
          />
          <div className="absolute top-14 left-2.5 bg-neutral-500/50 text-white px-2 rounded">
            Deck: {deckStore.deck.length}
          </div>
        </div>

        <DiscardPileView discardPile={deckStore.discardPile} />
      </div>

      <div className="h-[120px] border rounded bg-rose-700/80 flex flex-col items-center justify-center mt-auto">
        <p>P2: {playerStore.players["p2"].name}</p>
        <p>🌀SP: {playerStore.players["p2"].soulPoints}</p>
        <p>🔥FP: {playerStore.players["p2"].favorPoints}</p>
        <p>🃏Cartas: {handStore.hands["p2"].cards.length}</p>
      </div>
    </div>
  );
};

export default observer(LeftPanelView);
