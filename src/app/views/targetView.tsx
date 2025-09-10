"use client";
import React from "react";
import { observer } from "mobx-react";
import targetStore from "../stores/targetStore";
import { filterFieldType } from "../lib/gameHelpers/field";
import Card from "../models/card";
import Image from "next/image";
import Field from "../models/field";

type TargetViewProps = {
  field: Field;
};
const TargetView = observer(({ field }: TargetViewProps) => {
  if (!targetStore.isTargetModalOpen || !targetStore.targetRequirements)
    return null;

  const { targetRequirements, selectedTargets } = targetStore;

  const getAvailableTargets = () => {
    let targets: Card[] = [];

    if (targetRequirements.location === "field") {
      if (Array.isArray(targetRequirements.type)) {
        targets = targetRequirements.type.flatMap(type =>
            filterFieldType(field, type)
        );
    } else {
        targets = filterFieldType(field, targetRequirements.type);
    }
    }

    return targets;
  };

  const availableTargets = getAvailableTargets();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="bg-neutral-700 p-6 rounded max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">
          {"Select Targets"} ({selectedTargets.length}/
          {targetRequirements.count})
        </h2>

        <div className="flex gap-2 flex-wrap mb-6 max-h-60 overflow-y-auto">
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
            disabled={selectedTargets.length !== targetRequirements.count}
            onClick={() => targetStore.confirmSelection()}
            className={`px-4 py-2 rounded text-white transition ${
              selectedTargets.length === targetRequirements.count
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
