import { observer } from "mobx-react";
import Hand from "../models/hand";
import Card from "../models/card";

type HandViewProps = {
  hand: Hand;
  onCardClick?: (card: Card | null) => void;
  selectableFilter?: (card: Card) => boolean;
};

const HandView = observer(({ hand, onCardClick, selectableFilter }: HandViewProps) => {
  return (
    <div
      className="flex justify-start overflow-x-auto max-w-full"
      style={{ maxWidth: "600px", padding: "0 8px" }}
    >
      {hand.cards.map((card) => {
        const isSelectable = selectableFilter?.(card) ?? false;

        return (
          <img
            key={card.id}
            src={`/cards/${card.name}.png`}
            alt={card.name}
            className={`w-24 h-36 mx-1 flex-shrink-0 cursor-pointer transition-transform duration-200 ${
              isSelectable ? "border-4 border-yellow-400 scale-105" : ""
            }`}
            onClick={() => onCardClick?.(card)}
          />
        );
      })}
    </div>
  );
});

export default HandView;
