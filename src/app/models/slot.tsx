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
}

export class EmptySlot {
  card = null;
  owner = "Empty";
}

export type GridSlot = Slot | EmptySlot;
