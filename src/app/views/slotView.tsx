import React from "react";
import { observer } from "mobx-react";
import { Slot } from "../components/field";

type SlotViewProps = {
  slot: Slot;
  onClick?: () => void;
};

const SlotView: React.FC<SlotViewProps> = ({ slot, onClick }) => {
  let content;

  if (slot.card) {
    content = (
      <img
        src={`/cards/${slot.card.name}.png`}
        alt={slot.card.name}
        className="w-24 h-36 rounded"
      />
    );
  } else {
    content = (
      <div className="w-24 h-36 border-2 border-dashed border-gray-500 rounded bg-neutral-900" />
    );
  }

  return (
    <div
      className="relative cursor-pointer hover:scale-110 transition-transform"
      onClick={onClick}
    >
      {slot.owner && (
        <div className="absolute top-1 left-1 text-xs text-white bg-gray-700 px-1 rounded">
          {slot.owner.toUpperCase()}
        </div>
      )}
      {content}
    </div>
  );
};

export default observer(SlotView);
