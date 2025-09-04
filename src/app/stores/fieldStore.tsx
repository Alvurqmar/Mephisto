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

const fieldStore = new FieldStore();
export default fieldStore;
