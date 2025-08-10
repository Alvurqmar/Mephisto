import { makeAutoObservable } from "mobx";
import gameStore from "../stores/gameStore";

class Player {
  key: string = "";
  name: string = "";
  favorPoints = 0;
  soulPoints = 0;
  isWinner: boolean = false;

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
    gameStore.checkVictory(this);
  }
  serialize() {
    return {
      key: this.key,
      name: this.name,
      favorPoints: this.favorPoints,
      soulPoints: this.soulPoints,
      isWinner: this.isWinner,
    };
  }

  static deserialize(data: any) {
    const player = new Player(data.name, data.key);
    player.favorPoints = data.favorPoints;
    player.soulPoints = data.soulPoints;
    player.isWinner = data.isWinner;
    return player;
  }
}

export default Player;
