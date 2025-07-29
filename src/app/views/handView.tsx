import { observer } from "mobx-react";
import Hand from "../stores/hand";
import Card from "../models/card";

type HandView = {
  hand: Hand;
  onCardClick?: (card: Card | null) => void;
};

const HandView = observer(({ hand, onCardClick }: HandView) => {
  return (
    <div className="flex justify-center">
      {hand.cards.map((card) => (
        <img
          key={card.id}
          src={`/cards/${card.name}.png`}
          alt={card.name}
          className="w-24 h-36 mx-1 cursor-pointer"
          onClick={() => onCardClick?.(card)}
        />
      ))}
    </div>
  );
});
export default HandView;
