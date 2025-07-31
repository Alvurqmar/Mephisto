import { observer } from "mobx-react";
import Hand from "../models/hand";
import Card from "../models/card";

type HandView = {
  hand: Hand;
  onCardClick?: (card: Card | null) => void;
};

const HandView = observer(({ hand, onCardClick }: HandView) => {
  return (
    <div
      className="flex justify-start overflow-x-auto max-w-full"
      style={{ maxWidth: "600px", padding: "0 8px" }}
    >
      {hand.cards.map((card) => (
        <img
          key={card.id}
          src={`/cards/${card.name}.png`}
          alt={card.name}
          className="w-24 h-36 mx-1 flex-shrink-0 cursor-pointer"
          onClick={() => onCardClick?.(card)}
        />
      ))}
    </div>
  );
});
export default HandView;
