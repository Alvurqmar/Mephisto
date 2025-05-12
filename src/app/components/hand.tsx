import Card, { cardImg } from "./card";

interface HandProps {
  cards: Card[];
  isOpponent?: boolean;
  onCardHover?: (card: Card) => void;
  onCardClick?: (card: Card) => void;
  isCurrentPlayer: boolean; // Nuevo estado para saber si es el jugador actual
}

export default function Hand({
  cards,
  isOpponent = false,
  onCardHover,
  onCardClick,
  isCurrentPlayer,
}: HandProps) {
  return (
    <div className={`flex justify-center space-x-2 p-2`}>
      {cards.map((card, index) =>
        isOpponent ? (
          !isCurrentPlayer ? (
            <img
              key={index}
              src="/cards/CardBack.png"
              alt="Hidden Card"
              width={80}
              height={100}
              className="rounded-lg"
            />
          ) : (
            <div
              key={index}
              onMouseEnter={() => onCardHover && onCardHover(card)}
              onClick={() => onCardClick && onCardClick(card)}
              className="transition-transform hover:-translate-y-2"
            >
              {cardImg(card)}
            </div>
          )
        ) : (
          <div
            key={index}
            onMouseEnter={() => onCardHover && onCardHover(card)}
            onClick={() => onCardClick && onCardClick(card)}
            className="transition-transform hover:-translate-y-2"
          >
            {cardImg(card)}
          </div>
        )
      )}
    </div>
  );
}
