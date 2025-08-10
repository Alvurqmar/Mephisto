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

  static deserialize(data: any): Card {
    const normalized = {
      id: data.id,
      name: data.name,
      type: data.type,
      cost: data.cost,
      attack: data.attack,
      durability: data.durability,
      effectId: data.effectId ?? data.effectid ?? "",
      effectType: data.effectType ?? data.effecttype ?? "",
      soulPts: data.soulPts ?? data.soulpts ?? 0,
      owner: data.owner ?? null,
      isTapped: data.isTapped ?? data.istapped ?? false,
    };

    return new Card(normalized);
  }
}

export interface CardData {
  id: number;
  name: string;
  type: CardType;
  cost: number;
  attack: number;
  durability: number;
  effectId: string;
  effectType: EffectType;
  soulPts: number;
}
export default Card;
