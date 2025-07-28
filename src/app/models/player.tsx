import { makeAutoObservable } from "mobx";

class Player {
  name: string = "";
  favorPoints = 0;
  soulPoints = 0;

  constructor(name: string) {
    this.name = name;
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.name = name;
  }

  updateFP(amount: number) {
    this.favorPoints += amount;
  }

  updateSP(amount: number) {
    this.soulPoints += amount;
  }
}

export default Player;
