import { makeAutoObservable } from "mobx";

class Player {
  key: string = "";
  name: string = "";
  favorPoints = 0;
  soulPoints = 0;
  isWinner: boolean = false;
  orientation: "horizontal" | "vertical" = "horizontal";

  constructor(name: string, key: string, orientation: "horizontal" | "vertical" = "horizontal") {
    this.name = name;
    this.key = key;
    this.orientation = orientation;
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.name = name;
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
    };
  }

  static deserialize(key: string, data: PlayerData) {
    const player = new Player(data.name, key, data.orientation);
    player.favorPoints = data.favorPoints;
    player.soulPoints = data.soulPoints;
    player.isWinner = data.isWinner;
    return player;
  }
}

export interface PlayerData {
  name: string;
  favorPoints: number;
  soulPoints: number;
  isWinner: boolean;
  orientation: "horizontal" | "vertical";
}


export default Player;
