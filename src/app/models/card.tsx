import { makeAutoObservable } from "mobx";

export enum EffectType {
  ETB = "ETB",
  CE = "CE",
  AA = "AA",
}

export enum CardType {
  MONSTER = "MONSTER",
  ITEM = "ITEM",
  WEAPON = "WEAPON",
  SPELL = "SPELL",
}

class Card {
  id!: number;
  name!: string;
  type!: CardType;
  cost!: number;
  attack!: number;
  durability!: number;
  effectId!: string;
  effectType!: EffectType;
  soulPts!: number;
  owner?: string | null;
  isTapped = false;

  constructor(data: {
    id: number;
    name: string;
    type: CardType;
    cost: number;
    attack: number;
    durability: number;
    effectId: string;
    effectType: EffectType;
    soulPts: number;
    owner?: string | null;
    isTapped?: boolean;
  }) {
    Object.assign(this, data);
    makeAutoObservable(this);
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      cost: this.cost,
      attack: this.attack,
      durability: this.durability,
      effectId: this.effectId,
      effectType: this.effectType,
      soulPts: this.soulPts,
      owner: this.owner ?? null,
      isTapped: this.isTapped,
    };
  }

static deserialize(data: CardData): Card {
  return new Card({
    id: data.id,
    name: data.name,
    type: data.type,
    cost: data.cost,
    attack: data.attack,
    durability: data.durability,
    effectId: data.effectid,
    effectType: data.effecttype as EffectType,
    soulPts: data.soulpts,
    owner: data.owner ?? null,
    isTapped: data.istapped ?? false,
  });
}
}

export interface CardData {
  id: number;
  name: string;
  type: CardType;
  cost: number;
  attack: number;
  durability: number;
  effectid: string;
  effecttype: string;
  soulpts: number;
  owner?: string | null;
  istapped?: boolean;
}
export default Card;
