import { observer } from "mobx-react";
import Card from "../models/card";
import Hand from "../models/hand";

type HandViewProps = {
  hand: Hand;
  playerName?: string;
  onCardClick?: (card: Card | null) => void;
  selectableFilter?: (card: Card) => boolean;
};


const HandView = observer(({ hand, playerName, onCardClick, selectableFilter }: HandViewProps) => {
  return (
    <div className="flex flex-col items-start max-w-full px-2">
      {playerName && (
        <p className="flex h-6 bg-neutral-700 justify-center items-center text-m font-bold w-full">
          Mano de {playerName}
        </p>
      )}

      <div className="flex justify-start overflow-x-auto w-full">
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
    </div>
  );
});


export default HandView;
