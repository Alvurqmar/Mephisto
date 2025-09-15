import { makeAutoObservable } from "mobx";

class Player {
  key: string = "";
  name: string = "";
  favorPoints = 0;
  soulPoints = 0;
  isWinner: boolean = false;
  orientation: "horizontal" | "vertical" = "horizontal";
  passiveEffects: string[] = [];

  constructor(name: string, key: string, orientation: "horizontal" | "vertical" = "horizontal") {
    this.name = name;
    this.key = key;
    this.orientation = orientation;
    makeAutoObservable(this);
  }

  setOrientation(orientation: "horizontal" | "vertical") {
    this.orientation = orientation;
  }
  serialize() {
    return {
      name: this.name,
      favorPoints: this.favorPoints,
      soulPoints: this.soulPoints,
      isWinner: this.isWinner,
      orientation: this.orientation,
      passiveEffects: this.passiveEffects,
    };
  }

  static deserialize(key: string, data: PlayerData) {
    const player = new Player(data.name, key, data.orientation);
    player.favorPoints = data.favorPoints;
    player.soulPoints = data.soulPoints;
    player.isWinner = data.isWinner;
    player.passiveEffects = data.passiveEffects;
    return player;
  }
}

export interface PlayerData {
  name: string;
  favorPoints: number;
  soulPoints: number;
  isWinner: boolean;
  orientation: "horizontal" | "vertical";
  passiveEffects: string[];
}


export default Player;
