import { makeAutoObservable } from "mobx";
import Player, { PlayerData } from "../models/player";

class PlayerStore {
  players: Record<string, Player> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setPlayers(playersData: Record<string, PlayerData>) {
    this.players = Object.fromEntries(
      Object.entries(playersData).map(([key, playerData]) => [
        key,
        Player.deserialize(key, playerData),
      ])
    );
  }
}

const playerStore = new PlayerStore();
export default playerStore;
