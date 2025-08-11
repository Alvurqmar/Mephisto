import { makeAutoObservable } from "mobx";
import Field from "../models/field";

class FieldStore {
  field: Field = new Field(3, 6);

  constructor() {
    makeAutoObservable(this);
  }

  setField(fieldData: any) {
    this.field = Field.deserialize(fieldData);
  }
}

export default new FieldStore();
