import { makeAutoObservable } from "mobx";


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

class Card {
  id!: number;
  name!: string;
  type!: CardType;
  cost!: number;
  attack!: number;
  durability!: number;
  effectId!: string;
  effectType!: CardEffectType;
  soulpts!: number;

  constructor(data: {
    id: number;
    name: string;
    type: CardType;
    cost: number;
    attack: number;
    durability: number;
    effectId: string;
    effectType: CardEffectType;
    soulpts: number;
  }) {
    Object.assign(this, data);
    makeAutoObservable(this);
  }
}

export default Card;
