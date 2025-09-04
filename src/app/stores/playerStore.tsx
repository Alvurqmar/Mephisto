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

  updatePlayer(key: string, playerData: PlayerData) {
    this.players[key] = Player.deserialize(key, playerData);
  }

  getOpponents(playerKey: string): Player[] {
  return Object.entries(this.players)
    .filter(([key]) => key !== playerKey)
    .map(([, player]) => player);
}

  checkVictory(playerKey: string, winningSoulPoints: number): boolean {
    const player = this.players[playerKey];
    if (!player) return false;

    if (player.soulPoints >= winningSoulPoints) {
      player.isWinner = true;
      return true;
    }
    return false;
  }

}

const playerStore = new PlayerStore();
export default playerStore;
