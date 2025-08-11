import { makeAutoObservable } from "mobx";
import Player from "../models/player";

class PlayerStore {
  players: Record<string, Player> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setPlayers(playersData: Record<string, any>) {
    this.players = Object.fromEntries(
      Object.entries(playersData).map(([key, playerData]) => [
        key,
        Player.deserialize(playerData),
      ])
    );
  }

  updatePlayer(key: string, playerData: any) {
    this.players[key] = Player.deserialize(playerData);
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

export default new PlayerStore();
