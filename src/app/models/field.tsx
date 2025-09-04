import { makeAutoObservable } from "mobx";
import Card, { CardData } from "./card";
import { EmptySlot, GridSlot, Slot } from "./slot";

class Field {
  slots: GridSlot[][] = [];
  rows: number;
  columns: number;

  constructor(rows: number, columns: number, mode: "2P" | "3-4P" = "2P") {
    this.rows = rows;
    this.columns = columns;
    makeAutoObservable(this);

    if (mode === "2P") {
      this.initializeField2P();
    } else if (mode === "3-4P") {
      this.initializeField34P();
    }
  }

  initializeField2P() {
    this.slots = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.columns }, () => new Slot())
    );
  }

  initializeField34P() {
    const centerColStart = 2;
    const centerColEnd = 4;
    const centerRowStart = 2;
    const centerRowEnd = 4;

    this.slots = [];

    for (let row = 0; row < this.rows; row++) {
      const slotRow: GridSlot[] = [];

      for (let col = 0; col < this.columns; col++) {
        const inHorizontal = row >= centerRowStart && row <= centerRowEnd;
        const inVertical = col >= centerColStart && col <= centerColEnd;

        const isDiagonalEmpty =
          (row === 4 && col === 2) ||
          (row === 3 && col === 3) ||
          (row === 2 && col === 4);

        if ((inHorizontal || inVertical) && !isDiagonalEmpty) {
          slotRow.push(new Slot());
        } else {
          slotRow.push(new EmptySlot());
        }
      }

      this.slots.push(slotRow);
    }
  }

  isSlot(row: number, col: number): boolean {
    return this.inBounds(row, col) && this.slots[row][col] instanceof Slot;
  }

  setFieldOwners2P = (field: Field) => {
    const rows = field.rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 2; col++) {
        field.setOwner(row, col, "p1");
      }

      for (let col = 2; col < 4; col++) {
        field.setOwner(row, col, null);
      }

      for (let col = 4; col < 6; col++) {
        field.setOwner(row, col, "p2");
      }
    }
  };

  setFieldOwners34P = (field: Field, playerKeys: string[]) => {
    const hasP4 = playerKeys.includes("p4");

    for (let row = 0; row < field.rows; row++) {
      for (let col = 0; col < field.columns; col++) {
        if (!(field.slots[row][col] instanceof Slot)) continue;

        if (col < 2) {
          field.setOwner(row, col, "p2");
        } else if (col > 4) {
          if (hasP4) {
            field.setOwner(row, col, "p4");
          } else {
            field.slots[row][col] = new EmptySlot();
          }
        } else if (row < 2 && col >= 2 && col <= 4) {
          field.setOwner(row, col, "p3");
        } else if (row > 4 && col >= 2 && col <= 4) {
          field.setOwner(row, col, "p1");
        } else {
          field.setOwner(row, col, null);
        }
      }
    }
  };

  setCard(row: number, col: number, card: Card | null) {
    if (this.isSlot(row, col)) {
      (this.slots[row][col] as Slot).setCard(card);
    }
  }

  setOwner(row: number, col: number, owner: string | null) {
    if (this.isSlot(row, col)) {
      (this.slots[row][col] as Slot).setOwner(owner);
    }
  }

  slotClick(row: number, col: number) {
    if (this.isSlot(row, col)) {
      const slot = this.slots[row][col] as Slot;
      if (slot.card) {
        slot.setCard(null);
      }
    }
  }

  getSlot(row: number, col: number): Slot | null {
    if (this.isSlot(row, col)) {
      return this.slots[row][col] as Slot;
    }
    return null;
  }

  inBounds(row: number, col: number): boolean {
    return row >= 0 && col >= 0 && row < this.rows && col < this.columns;
  }

  serialize() {
    return {
      rows: this.rows,
      columns: this.columns,
      slots: this.slots.map((row) =>
        row.map((slot) => {
          return slot.serialize();
        })
      ),
    };
  }

  static deserialize(data: {
    rows: number;
    columns: number;
    slots: { card: CardData | null; owner: string | null }[][];
  }) {
    const field = new Field(data.rows, data.columns);

    field.slots = data.slots.map((row) =>
      row.map((slotData) => {
        if (slotData.card) {
          return Slot.deserialize(slotData);
        }
        if (slotData.owner === "Empty") {
          return EmptySlot.deserialize();
        }
        return Slot.deserialize({ ...slotData, card: null });
      })
    );

    return field;
  }
}

export default Field;
