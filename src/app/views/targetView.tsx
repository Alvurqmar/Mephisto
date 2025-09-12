"use client";
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

  const getAvailableTargets = () => {
    if (!currentRequirements) {
      return [];
    }

    let targets: Card[] = [];

    if (currentRequirements.location === "field") {
      if (Array.isArray(currentRequirements.type)) {
        targets = currentRequirements.type.flatMap(type =>
          filterFieldType(field, type)
        );
      } else {
        targets = filterFieldType(field, currentRequirements.type);
      }
    } else if (currentRequirements.location === "lane" && effectCardId) {
      if (Array.isArray(currentRequirements.type)) {
        targets = currentRequirements.type.flatMap(type =>
          filterLaneType(field, parseInt(effectCardId), type, playerStore.players[phaseStore.currentTurn].orientation)
        );
      } else {
        targets = filterLaneType(field, parseInt(effectCardId), currentRequirements.type, playerStore.players[phaseStore.currentTurn].orientation);
      }
    } else if (currentRequirements.location === "hand") {
      const player = playerStore.players[phaseStore.currentTurn].key;
      const hand = handStore.hands[player];

      if (Array.isArray(currentRequirements.type)) {
        targets = currentRequirements.type.flatMap(type =>
          filterHandType(hand, type)
        );
      } else {
        targets = filterHandType(hand, currentRequirements.type);
      }
    }

    if (currentRequirements.owner && currentRequirements.owner !== "any") {
      if (currentRequirements.owner === "opponent") {
        const playerIds = Object.keys(playerStore.players);
        const opponentId = playerIds.find(id => id !== phaseStore.currentTurn);
        if(opponentId) {
          targets = filterCardOwner(targets, opponentId);
        }
      } else {
        targets = filterCardOwner(targets, currentRequirements.owner);
      }
    }

    const uniqueTargets = Array.from(new Set(targets.map(card => card.id)))
      .map(id => targets.find(card => card.id === id)!);

    return uniqueTargets;
  };

  const availableTargets = getAvailableTargets();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="bg-neutral-700 p-6 rounded max-w-md w-full">
        <h2 className="text-lg font-bold mb-4 text-center">
          {`Select ${currentRequirements.count} target(s)`}
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {availableTargets.map((target) => (
            <div
              key={target.id}
              className={`relative cursor-pointer transition-transform duration-200 transform hover:scale-105 border-2 rounded ${
                selectedTargets.some(t => t.id === target.id)
                  ? "border-blue-600"
                  : "border-transparent hover:border-blue-300"
              }`}
              onClick={() => targetStore.toggleTarget(target)}
            >
              <div className="relative w-16 h-24">
                <Image
                  src={`/cards/${target.name}.png`}
                  alt={target.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            </div>
          ))}

          {availableTargets.length === 0 && (
            <p className="text-gray-400 text-center">No available targets</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => targetStore.closeTargetModal()}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-400 transition"
          >
            Cancel
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
});

export default TargetView;