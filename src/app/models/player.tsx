import { makeAutoObservable } from "mobx";

class Player {
  key: string = "";
  name: string = "";
  favorPoints = 0;
  soulPoints = 0;

  constructor(name: string, key: string) {
    this.name = name;
    this.key = key;
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.name = name;
  }

  updateFP(amount: number) {
    this.favorPoints = Math.max(0, this.favorPoints + amount);
  }

  updateSP(amount: number) {
    this.soulPoints = Math.max(0, this.soulPoints + amount);
  }
}

export default Player;
