export default interface Card {
  id: number;
  name: string;
  type: CardType;
  cost: number;
  attack: number;
  durability: number;
  effectId: string;
  effectType: CardEffectType;
  soulpts: number;
}

export enum CardEffectType {
  ETB = "ETB",
  CONTINUOUS_EFFECT = "CE",
  ACTIVATED_ABILITY = "AA",
}

export enum CardType {
  MONSTER = "MONSTER",
  ITEM = "ITEM",
  WEAPON = "WEAPON",
  SPELL = "SPELL",
}

export function cardImg(
  card: Card,
  onHover?: () => void,
  onLeave?: () => void
) {
  return (
    <img
      src={`/cards/${card.name}.png`}
      alt={card.name}
      width={100}
      height={120}
      className="rounded-lg transition-transform transform hover:scale-110"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    />
  );
}
