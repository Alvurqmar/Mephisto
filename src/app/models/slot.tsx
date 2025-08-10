import { makeAutoObservable } from "mobx";
import Card from "./card";

export class Slot {
  card: Card | null = null;
  owner: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCard(card: Card | null) {
    this.card = card;
  }

  setOwner(player: string | null) {
    this.owner = player;
  }

  serialize() {
    return {
      card: this.card ? this.card.serialize() : null,
      owner: this.owner,
    };
  }

  static deserialize(data: { card: any | null; owner: string | null }) {
    const slot = new Slot();
    slot.owner = data.owner;
    slot.card = data.card ? Card.deserialize(data.card) : null;
    return slot;
  }
}

export class EmptySlot {
  card = null;
  owner = "Empty";

  serialize() {
    return {
      card: null,
      owner: this.owner,
    };
  }
  static deserialize(_data: { card: any; owner: string | null }) {
    const emptySlot = new EmptySlot();
    emptySlot.owner = "Empty";
    return emptySlot;
  }
}

export type GridSlot = Slot | EmptySlot;
