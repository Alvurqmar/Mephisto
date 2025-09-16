'use client';
import React from "react";
import { observer } from "mobx-react";
import targetStore from "../stores/targetStore";
import { filterFieldType, filterLaneType } from "../lib/gameHelpers/field";
import Card from "../models/card";
import Image from "next/image";
import Field from "../models/field";
import playerStore from "../stores/playerStore";
import phaseStore from "../stores/phaseStore";
import { filterCardOwner } from "../lib/gameHelpers/card";
import handStore from "../stores/handStore";
import { filterHandType } from "../lib/gameHelpers/hand";

type TargetViewProps = {
  field: Field;
};

const TargetView = observer(({ field }: TargetViewProps) => {
  if (!targetStore.isTargetModalOpen || !targetStore.targetRequirements)
    return null;

  const { selectedTargets, effectCardId, targetRequirements, currentRequirementIndex } = targetStore;

  const currentRequirements = Array.isArray(targetRequirements)
    ? targetRequirements[currentRequirementIndex]
    : targetRequirements;

  if (!currentRequirements) {
    return null;
  }
  
  const getTargetsByLocation = (): Card[] => {
    const { location, type } = currentRequirements;
    
    if (location === "field") {
      return Array.isArray(type) ? 
        type.flatMap(t => filterFieldType(field, t)) : 
        filterFieldType(field, type);
    } 
    
    if (location === "lane" && effectCardId) {
      const orientation = playerStore.players[phaseStore.currentTurn].orientation;
      return Array.isArray(type) ? 
        type.flatMap(t => filterLaneType(field, parseInt(effectCardId), t, orientation)) :
        filterLaneType(field, parseInt(effectCardId), type, orientation);
    } 
    
    if (location === "hand") {
      const playerKey = playerStore.players[phaseStore.currentTurn].key;
      const hand = handStore.hands[playerKey];
      return Array.isArray(type) ?
        type.flatMap(t => filterHandType(hand, t)) :
        filterHandType(hand, type);
    }
    
    return [];
  };

  const filterTargetsByOwner = (targets: Card[]): Card[] => {
    const { owner } = currentRequirements;
    const playerIds = Object.keys(playerStore.players);
    
    if (owner === "opponent") {
      const opponentId = playerIds.find(id => id !== phaseStore.currentTurn);
      return opponentId ? filterCardOwner(targets, opponentId) : [];
    }
    
    if (owner === "own") {
      const currentPlayerId = phaseStore.currentTurn;
      return filterCardOwner(targets, currentPlayerId);
    }
    
    return targets;
  };

  const getAvailableTargets = (): Card[] => {
          let targets = getTargetsByLocation();
    targets = filterTargetsByOwner(targets);
    
    const uniqueTargets = Array.from(new Set(targets.map(card => card.id)))
      .map(id => targets.find(card => card.id === id)!);

    return uniqueTargets;
  };

  const availableTargets = getAvailableTargets();

return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
      <div className="bg-neutral-700 p-6 rounded max-w-xl w-full">
        <h3 className="text-xl font-bold mb-4">
          Selecciona {currentRequirements.count} objetivo(s). <br />
          {selectedTargets.length}/{currentRequirements.count} seleccionado(s)
        </h3>

        <div className="flex gap-4 flex-wrap mb-6 max-h-96 overflow-y-auto">
          {availableTargets.map((target) => (
            <div
              key={target.id}
              className={`rounded cursor-pointer border-4 transition ${
                selectedTargets.some((t) => t.id === target.id)
                  ? "border-blue-600"
                  : "border-transparent hover:border-blue-300"
              }`}
              onClick={() => targetStore.toggleTarget(target)}
            >
              <div className="relative w-24 h-36">
                <Image
                  src={`/cards/${target.name}.png`}
                  alt={target.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          ))}

          {availableTargets.length === 0 && (
            <p className="text-gray-400 text-center">No hay objetivos disponibles</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => targetStore.closeTargetModal()}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            disabled={selectedTargets.length !== currentRequirements.count}
            onClick={() => targetStore.confirmSelection()}
            className={`px-4 py-2 rounded text-white transition ${
              selectedTargets.length === currentRequirements.count
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
});

export default TargetView;