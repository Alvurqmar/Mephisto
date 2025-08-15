'use client';
import { observer } from "mobx-react";
import React from "react";
import cardActions from "../stores/actions/cardActions";
import phaseActions from "../stores/actions/phaseActions";
import playerStore from "../stores/playerStore";
import phaseStore from "../stores/phaseStore";

type PanelProps = {
  gameId: string;
  myPlayerKey: string;
};
const RightPanelView = ({ gameId, myPlayerKey}: PanelProps) => {
  const playerCount = Object.keys(playerStore.players).length;

  return (
    <div className={`flex flex-col h-full w-[110px]`}>
      {playerCount >= 3 && (
        <div className="h-[100px] border rounded bg-yellow-800/80 flex flex-col items-center justify-center mb-auto">
          <p>P3: {playerStore.players["p3"].name}</p>
          <p>🌀SP: {playerStore.players["p3"].soulPoints}</p>
          <p>✨FP: {playerStore.players["p3"].favorPoints}</p>
        </div>
      )}
      {myPlayerKey === phaseStore.currentTurn && (
      <button
        onClick={() => {
          phaseActions.changePhase(gameId,myPlayerKey);
          cardActions.selectCard(null);
        }}
        className="text-xl font-bold
            px-6 py-3 rounded
            bg-red-800 text-white
            hover:bg-red-600 active:bg-red-900
            transition-colors duration-150
            shadow-md"
      >
        Pasar Fase
      </button>
    )}
      <p className="border text-white bg-neutral-700/70 bg-opacity-70 px-2 rounded flex flex-col mt-4">
        <span className="mb-4">
          Turno {phaseStore.turnCounter}:{" "}
          {playerStore.players[phaseStore.currentTurn].name}
        </span>
        <span>Fase actual: {phaseStore.currentPhase}</span>
      </p>

      {playerCount === 4 && (
        <div className="h-[100px] border rounded bg-purple-800/80 flex flex-col items-center justify-center mt-auto">
          <p>P4: {playerStore.players["p4"].name}</p>
          <p>🌀SP: {playerStore.players["p4"].soulPoints}</p>
          <p>✨FP: {playerStore.players["p4"].favorPoints}</p>
        </div>
      )}
    </div>
  );
};

export default observer(RightPanelView);
