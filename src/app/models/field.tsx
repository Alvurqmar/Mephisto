import { makeAutoObservable } from "mobx";
import Card from "./card";

class Slot {
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

class Field {
  slots: Slot[][] = [];
  rows: number;
  columns: number;

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.initializeField();
    makeAutoObservable(this);
  }

  initializeField() {
    this.slots = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.columns }, () => new Slot())
    );
  }

  setCard(row: number, col: number, card: Card | null) {
    if (this.inBounds(row, col)) {
      this.slots[row][col].setCard(card);
    }
  }

  setOwner(row: number, col: number, owner: string | null) {
    if (this.inBounds(row, col)) {
      this.slots[row][col].setOwner(owner);
    }
  }

  slotClick(row: number, col: number) {
    if (this.inBounds(row, col)) {
      const slot = this.slots[row][col];
      if (slot.card) {
        slot.setCard(null);
      }
    }
  }

  getSlot(row: number, col: number): Slot | null {
    if (this.inBounds(row, col)) {
      return this.slots[row][col];
    }
    return null;
  }

  inBounds(row: number, col: number): boolean {
    return (
      row >= 0 &&
      col >= 0 &&
      row < this.rows &&
      col < this.columns
    );
  }
}
export default Field;
export { Slot };
