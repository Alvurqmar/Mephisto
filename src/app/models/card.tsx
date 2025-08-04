import { makeAutoObservable } from "mobx";


export enum EffectType {
  ETB = "ETB", //ENTER THE BATTLEFIELD
  CE = "CE",  //CONTINUOUS EFFECT
  AA = "AA",  //ACTIVATED ABILITY
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
  }) {
    Object.assign(this, data);
    makeAutoObservable(this);
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
