import { makeAutoObservable } from "mobx";
import Field from "../models/field";

class FieldStore {
  field: Field = new Field(3, 6);

  constructor() {
    makeAutoObservable(this);
  }

  setField(fieldData: Field) {
    this.field = Field.deserialize(fieldData);
  }

}
export function cardInField(field: Field, cardId: number) {
  for (let row = 0; row < field.slots.length; row++) {
    for (let col = 0; col < field.slots[row].length; col++) {
      const slot = field.slots[row][col];
      if (slot.card && slot.card.id === cardId) {
        return true;
      }
    }
  }
  return false;
}

const fieldStore = new FieldStore();
export default fieldStore;
